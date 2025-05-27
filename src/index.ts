#! /usr/bin/env node

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


// External libraries for styling
// @ts-ignore
import figlet from "figlet";
import gradient from "gradient-string";
import { execSync } from "child_process";

// Print a fancy banner
console.log(gradient.rainbow(figlet.textSync("Flinkord")));

const program = new Command();

function getInstalledVersion(): string {
    try {
        const result = execSync('npm list -g @flink/flinkord-cli --depth=0', { encoding: 'utf-8' });
        const match = /@flink\/flinkord-cli@([\d.]+)/.exec(result);
        return match ? match[1] : 'Version not found';
    } catch (error) {
        if (error instanceof Error) {
            return `Error fetching version: ${error.message}`;
        }
        return 'An unknown error occurred while fetching version';
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
    .action(() => {
        console.log("Setup command invoked");
        setupEnv().catch(e => console.error(e));
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
    .option("-u, --username <username>", "Username for Quinyx")
    .option("-p, --password <password>", "Password for Quinyx")
    .option("-h, --hub <hubSlug>", "The hub with shifts")
    .action((commandAndOptions) => {
        const { username, password, hub } = commandAndOptions;

        deleteShifts(hub, commandAndOptions.badge, username, password, true)
            .catch(e => console.error(e));
    });

// "add_shift" command – add a shift for Quinyx with a specific user and time range
const addQuinyxShift = new Command("add_shift")
    .description("Add a shift for Quinyx with a specific user and time range")
    .option("-u, --username <username>", "Username for Quinyx")
    .option("-p, --password <password>", "Password for Quinyx")
    .option("-b, --begin <beginDateTime>", "Begin date and time for the shift (format: YYYY-MM-DDTHH:mm:ss)")
    .option("-e, --end <endDateTime>", "End date and time for the shift (format: YYYY-MM-DDTHH:mm:ss)")
    .option("-h, --hub <hubSlug>", "The hub for the shift")
    .option("-n, --badge <badgeNumber>", "Badge number for another user")
    .action(async (options) => {
        const config = loadMergedConfig();

        const username = options.username ?? config.quinyxEmail;
        const password = options.password ?? config.quinyxPassword;
        const hub = options.hub ?? config.quinyxHub;
        const badge = options.badge ?? config.quinyxBadge;
        const shiftType = config.quinyxShiftType || QuinyxShiftType.HQ_EMPLOYEE;
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
            await addShift(hub, shiftType, username, password, isCli, begin, end);
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

export { addShift, create, deleteShifts, deliver, free, getOrderReturns, pick, setupEnv, cancel };