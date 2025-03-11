#! /usr/bin/env node
process.env.NODE_NO_WARNINGS = '1';
process.on('warning', (warning) => {
    if (warning.name === 'DeprecationWarning') {
        return;
    }
    console.warn(warning);
});

import { Command } from "commander";
import { addShift, create, deleteShifts, deliver, free, getOrderReturns, pick, setupEnv } from "./commands/index.js";
import { cancel } from "./commands/cancel.js";
import { QuinyxShiftType } from "./shared/enums.js";

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
        console.log("Create command invoked with:", commandAndOptions);

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
        free(commandAndOptions.hub).catch(e => console.error(e));
    });

// "deliver" command – deliver an order by its ID
const deliverOrder = new Command("deliver")
    .description("Deliver an order by specifying its ID")
    .argument("<orderId>", "ID of the order to deliver")
    .action((orderId) => {
        console.log("Deliver command invoked with order ID:", orderId);
        deliver(orderId).catch(e => console.error(e));
    });

// "cancel" command – cancel an order by its ID
const cancelOrder = new Command("cancel")
    .description("Cancel an order by specifying its ID")
    .argument("<order>", "ID of the order to cancel")
    .action((order) => {
        console.log("Cancel command invoked with order:", order);
        cancel(order).catch(e => console.error(e));
    });

// "setup" command – setup environment variables and configurations
const setup = new Command("setup")
    .description("Setup environment variables and configurations")
    .action(() => {
        console.log("Setup command invoked");
        setupEnv().catch(e => console.error(e));
    });

// "delete_shifts" command – delete all scheduled shifts from Quinyx
const deleteAllQuinyxShifts = new Command("delete_shifts")
    .description("Delete all scheduled shifts from Quinyx")
    .option("-u, --username <username>", "Username for Quinyx")
    .option("-p, --password <password>", "Password for Quinyx")
    .option("-h, --hub <hubSlug>", "The hub with shifts")
    .action((commandAndOptions) => {
        const { username, password, hub } = commandAndOptions;

        if (!username || !password) {
            console.error("Username and password are required!");
            return;
        }

        if (!hub) {
            console.error("Please pass hubSlug with -h option");
            return;
        }

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
    .option("-h, --hub <hubSlug>", "The hub for the shift (ensure that your user has all required permissions)")
    .option("-n, --badge <badgeNumber>", "Badge number for another user you want to schedule the shift for")
    .action((commandAndOptions) => {
        const { username, password, begin, end, hub, badge } = commandAndOptions;

        if (!username || !password) {
            console.error("Username and password are required!");
            return;
        }

        if (!hub) {
            console.error("Please pass hubSlug with -h option");
            return;
        }

        addShift(hub, badge, QuinyxShiftType.HQ_EMPLOYEE, username, password, begin, end)
            .catch(e => console.error(e));
    });

// "get_returns" command – retrieve order returns by order ID
const getReturns = new Command("get_returns")
    .description("Retrieve order returns by specifying order ID")
    .argument("<orderId>", "ID of the order to get returns for")
    .action((orderId) => {
        console.log("Get returns command invoked with order ID:", orderId);
        getOrderReturns(orderId).catch(e => console.error(e));
    });

// "pick" command – pick an order from a specific hub by order number
const pickOrder = new Command("pick")
    .description("Pick an order from a specific hub by order number")
    .requiredOption("-h, --hub <hub_slug>", "The hub for the order")
    .requiredOption("-o, --order <order_number>", "Order number for picking")
    .action((commandAndOptions) => {
        console.log("Pick command invoked with:", commandAndOptions);
        pick(commandAndOptions.order, commandAndOptions.hub).catch(e => console.error(e));
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

// Parse arguments if not running tests
if (!process.env.JEST_WORKER_ID) {
    program.parse(process.argv);
}

program.exitOverride((err) => {
    console.error("CLI exited unexpectedly:", err.message);
    throw err;
});

export { addShift, create, deleteShifts, deliver, free, getOrderReturns, pick, setupEnv, cancel };