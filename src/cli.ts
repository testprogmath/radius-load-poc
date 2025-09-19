#! /usr/bin/env node
process.removeAllListeners('warning');

import { Command } from "commander";
import {
    addShift,
    create,
    cancel,
    deleteShifts,
    deliver,
    free,
    getOrderReturns,
    pick,
    printConfig,
    setupEnv,
    stackOrders
} from "./commands/index.js";
import { QuinyxShiftType } from "./shared/enums.js";
import { loadMergedConfig } from "./loadMergedConfig.js";

// External libraries for styling (banner optional)
// @ts-ignore
import figlet from "figlet";
import gradient from "gradient-string";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Print banner only when not requesting help/version
const argv = process.argv.slice(2);
const showBanner = argv.length > 0 && !argv.includes("-h") && !argv.includes("--help") && !argv.includes("-v") && !argv.includes("--version");
if (showBanner) {
    console.log(gradient.rainbow(figlet.textSync("Flinkord")));
}

const program = new Command();

function getInstalledVersion(): string {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const pkgPath = path.resolve(__dirname, "..", "..", "package.json");
        const raw = fs.readFileSync(pkgPath, "utf-8");
        const pkg = JSON.parse(raw);
        return pkg.version ?? "unknown";
    } catch {
        return "unknown";
    }
}

const isCLI = true;

// --------------------
// CLI Commands
// --------------------

// "create" command – create an order
const createOrder = new Command("create")
    .description("Create an order with parameters or default values")
    .option("-h, --hub <hub_slug>", "The hub for the order")
    .option("-m, --email <email>", "The email to receive notifications about the order", "flinkordautotest@goflink.com")
    .option("-s, --shipping <clickAndCollect>", "A flag for clickAndCollect orders", "false")
    .option("-i, --instore", "A flag for in-store orders")
    .option("-d, --deliveryTag <tagValue>", "A delivery tag, possible values: outdoor, work, home, other")
    .option("-p, --products <products>", "Products array in the format sku1:quantity1,sku2:quantity2")
    .option("-l, --locale <locale>", "The locale for the order, e.g., en, de-DE, en-NL, fr-FR")
    .option("-c, --country <country>", "The country for the order, possible values: de, at, nl, fr")
    .action((commandAndOptions) => {
        console.debug("Create command invoked with:", commandAndOptions);
        loadMergedConfig();

        const options = {
            locale: commandAndOptions.locale,
            country: commandAndOptions.country,
            hubSlug: commandAndOptions.hub,
            email: commandAndOptions.email,
            clickAndCollect: commandAndOptions.shipping,
            isCLI: isCLI,
            inStore: commandAndOptions.instore !== undefined,
            deliveryTag: commandAndOptions.deliveryTag,
            productsArray: commandAndOptions.products
        };

        create(options)
            .catch(e => {
                console.error(e.message);
                process.exit(1);
            });
    });

// "free" command – free the hub for new operations
const freeHub = new Command("free")
    .description("Free the hub for new operations")
    .requiredOption("-h, --hub <hub_slug>", "The hub to open")
    .action((commandAndOptions) => {
        console.log("Free command invoked with:", commandAndOptions);
        loadMergedConfig();
        free(commandAndOptions.hub).catch(e => console.error(e));
    });

// "deliver" command – deliver an order by its ID
const deliverOrder = new Command("deliver")
    .description("Deliver an order by specifying its ID")
    .argument("<orderId>", "ID of the order to deliver")
    .action((orderId) => {
        console.log("Deliver command invoked with order ID:", orderId);
        loadMergedConfig();
        deliver(orderId).catch(e => console.error(e));
    });

// "cancel" command – cancel an order by its ID
const cancelOrder = new Command("cancel")
    .description("Cancel an order by specifying its ID")
    .argument("<order>", "ID of the order to cancel")
    .action((order) => {
        console.log("Cancel command invoked with order:", order);
        loadMergedConfig();
        cancel(order).catch(e => console.error(e));
    });

// "setup" command – setup environment variables and configurations
const setup = new Command("setup")
    .description("Setup environment variables and configurations")
    .option("-s, --secrets", "Setup secure secrets management with SOPS + Age encryption")
    .action(async (options) => {
        console.log("Setup command invoked");
        if (options.secrets) {
            try {
                await setupEnv();
            } catch (error) {
                console.error("❌ Secret setup failed:", error instanceof Error ? error.message : String(error));
                process.exit(1);
            }
        } else {
            setupEnv().catch(e => console.error(e));
        }
    });

const configCommand = new Command("config")
    .description("Print the current configuration used by flinkord-cli")
    .action(() => {
        loadMergedConfig();
        printConfig().catch(e => console.error(e));
    });

// "delete_shifts" command – delete all scheduled shifts from Quinyx
const deleteAllQuinyxShifts = new Command("delete_shifts")
    .description("Delete all scheduled shifts from Quinyx")
    .option("-u, --username <username>", "Manager username for Quinyx")
    .option("-p, --password <password>", "Manager password for Quinyx")
    .option("-h, --hub <hubSlug>", "The hub with shifts")
    .option("-n, --badge <badgeNumber>", "Badge number or email for another user")
    .action(async (options) => {
        const config = loadMergedConfig();
        const username = options.username ?? config.quinyxEmail;
        const password = options.password ?? config.quinyxPassword;
        const hub = options.hub ?? config.quinyxHub;
        const badge = options.badge ?? config.quinyxBadge;
        const isCli = config.quinyxIsCli !== false;

        const missing = [];
        if (!username) missing.push("username");
        if (!password) missing.push("password");
        if (!hub) missing.push("hub");
        if (!badge) missing.push("badge");

        if (missing.length > 0) {
            console.error(`❌ Missing required options: ${missing.join(", ")}`);
            console.error("You can provide them via CLI or set them in your config/ENV.");
            process.exit(1);
        }

        try {
            await deleteShifts(hub, username, password, badge, isCli);
        } catch (e) {
            console.error("❌ Shift deletion failed:", e);
            process.exit(1);
        }
    });

// "add_shift" command – add a shift for Quinyx with a specific user and time range
const addQuinyxShift = new Command("add_shift")
    .description("Add a shift for a Quinyx user with a specific time range.\n\nYou can use either:\n• your own Quinyx credentials (if you’re creating the shift for yourself), or\n• manager credentials (if you’re creating the shift for another user via badge number or email).\n\nUsername and password can be passed via CLI or config file (you can run flinkord setup to add them to the config file).")
    .option("-u, --username <username>", "Manager username for Quinyx")
    .option("-p, --password <password>", "Manager password for Quinyx")
    .option("-b, --begin <beginDateTime>", "Begin date and time for the shift (format: YYYY-MM-DDTHH:mm:ss)")
    .option("-e, --end <endDateTime>", "End date and time for the shift (format: YYYY-MM-DDTHH:mm:ss)")
    .option("-h, --hub <hubSlug>", "The hub for the shift")
    .option("-n, --badge <badgeNumber>", "Badge number or email for another user")
    .action(async (options) => {
        const config = loadMergedConfig();

        const username = options.username ?? config.quinyxEmail;
        const password = options.password ?? config.quinyxPassword;
        const hub = options.hub ?? config.quinyxHub;
        const badge = options.badge ?? config.quinyxBadge;
        const shiftType = QuinyxShiftType.HQ_EMPLOYEE;
        const isCli = config.quinyxIsCli !== false;
        const begin = options.begin;
        const end = options.end;

        const missing = [];
        if (!username) missing.push("username");
        if (!password) missing.push("password");
        if (!hub) missing.push("hub");
        if (!badge) missing.push("badge");

        if (missing.length > 0) {
            console.error(`❌ Missing required options: ${missing.join(", ")}`);
            console.error("You can provide them via CLI or set them in your config/ENV.");
            process.exit(1);
        }

        try {
            await addShift(hub, shiftType, username, password, badge, isCli, begin, end);
        } catch (e) {
            console.error("❌ Shift creation failed:", e);
            process.exit(1);
        }
    });

// "get_returns" command – retrieve order returns by order ID
const getReturns = new Command("get_returns")
    .description("Retrieve order returns by specifying order ID")
    .argument("<orderId>", "ID of the order to get returns for")
    .action((orderId) => {
        console.log("Get returns command invoked with order ID:", orderId);
        loadMergedConfig();
        getOrderReturns(orderId).catch(e => console.error(e));
    });

// "pick" command – pick an order from a specific hub by order number
const pickOrder = new Command("pick")
    .description("Pick an order from a specific hub by order number")
    .requiredOption("-h, --hub <hub_slug>", "The hub for the order")
    .requiredOption("-o, --order <order_number>", "Order number for picking")
    .action((commandAndOptions) => {
        console.log("Pick command invoked with:", commandAndOptions);
        loadMergedConfig();
        pick(commandAndOptions.order, commandAndOptions.hub).catch(e => console.error(e));
    });

const stackOrdersCommand = new Command("stack_orders")
    .description("Stack orders for a given hub")
    .requiredOption("-h, --hub <hub_slug>", "The hub for the order")
    .requiredOption("-o, --orders <orderIds...>", "List of order IDs to stack")
    .action((commandAndOptions) => {
        const { hub, orders } = commandAndOptions;
        loadMergedConfig();
        stackOrders({ hub, orderIds: orders });
    });

// --------------------
// Main CLI configuration
// --------------------
program
    .description("A CLI tool for order management")
    .version(getInstalledVersion(), "-v, --version", "Output the current version")
    .option("--debug", "Enable debug mode for verbose output")
    .showSuggestionAfterError(true)
    .allowUnknownOption();

// Add commands to the program
program.addCommand(createOrder);
program.addCommand(freeHub);
program.addCommand(deliverOrder);
program.addCommand(cancelOrder);
program.addCommand(setup);
program.addCommand(addQuinyxShift);
program.addCommand(deleteAllQuinyxShifts);
program.addCommand(getReturns);
program.addCommand(pickOrder);
program.addCommand(stackOrdersCommand);
program.addCommand(configCommand);

// Parse arguments if not running tests
if (!process.env.VITEST) {
    program.parse(process.argv);
}

program.exitOverride((err) => {
    console.error("CLI exited unexpectedly:", err.message);
    throw err;
});
