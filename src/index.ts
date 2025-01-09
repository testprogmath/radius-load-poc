#! /usr/bin/env node
import {resolveLocale} from "./utils/locale.js";

process.env.NODE_NO_WARNINGS = '1';
process.on('warning', (warning) => {
    if (warning.name === 'DeprecationWarning') {
        return;
    }
    console.warn(warning);
});

import {Command} from "commander";
import {addShift, create, deleteShifts, deliver, free, getOrderReturns, pick, setupEnv} from "./commands/index.js";
import {CreateOptions} from "./commands/create.js";
import {cancel} from "./commands/cancel.js";
import {QuinyxShiftType} from "./shared/enums.js";

// @ts-ignore
import figlet from "figlet";
import gradient from "gradient-string";
import {execSync} from "child_process";

console.log(gradient.rainbow(figlet.textSync("Flinkord")));

const program = new Command();


const createOrder = new Command("create");
const freeHub = new Command("free");
const deliverOrder = new Command("deliver");
const cancelOrder = new Command("cancel");

const setup = new Command("setup");

const addQuinyxShift = new Command("add_shift");

const deleteAllQuinyxShifts = new Command("delete_shifts");

const getReturns = new Command("get_returns");

const pickOrder = new Command("pick")

export {create} from "./commands/create.js";
export {free} from "./commands/free.js";
export {deliver} from "./commands/deliver.js";
export {cancel} from "./commands/cancel.js";
export {setupEnv} from "./commands/setup.js";
export {addShift} from "./commands/addShift.js"
export {deleteShifts} from "./commands/deleteShifts.js"
export {getOrderReturns} from "./commands/getOrderReturns.js"
export {pick} from "./commands/pick.js"

const isCLI = true;

function getInstalledVersion() {
    try {
        const result = execSync('npm list -g @flink/flinkord-cli --depth=0', {encoding: 'utf-8'});
        const match = /@flink\/flinkord-cli@([\d.]+)/.exec(result);
        if (match) {
            return match[1];
        } else {
            return 'Version not found';
        }
    } catch (error) {
        if (error instanceof Error) {
            return `Error fetching version: ${error.message}`;
        }
        return 'An unknown error occurred while fetching version';
    }
}

createOrder
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

        const options: CreateOptions = {
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

freeHub
    .requiredOption("-h, --hub <hub_slug>", "the hub to open")
    .action((commandAndOptions) => {
        console.log(commandAndOptions);
        free(commandAndOptions.hub).catch(e => console.log(e));
    });

deliverOrder.argument("orderId").action((orderId) => {
    console.log(orderId);
    deliver(orderId).catch(e => console.log(e));
});

cancelOrder.argument("order").action(order => {
    console.log(order);
    cancel(order).catch(e => console.log(e));
})
setup
    .action(() => {
        setupEnv().catch(e => console.log(e));
    });

deleteAllQuinyxShifts
    .option("-u, --username <username>", "Username for Quinyx")
    .option("-p, --password <password>", "Password for Quinyx")
    .option("-h, --hub <hubSlug>", "the hub with shifts")
    .action((commandAndOptions) => {
        const {username, password, hub, badge} = commandAndOptions;


        if (!username || !password) {
            console.error("Username and password are required!");
            return;
        }

        if (!hub) {
            console.error("Please pass hubSlug with -h option");
            return;
        }

        deleteShifts(hub, badge, username, password, true)
            .catch(e => console.log(e));
    });


addQuinyxShift
    .option("-u, --username <username>", "Username for Quinyx")
    .option("-p, --password <password>", "Password for Quinyx")
    .option("-b, --begin <beginDateTime>", "Begin date and time for the shift (format: YYYY-MM-DDTHH:mm:ss)")
    .option("-e, --end <endDateTime>", "End date and time for the shift (format: YYYY-MM-DDTHH:mm:ss)")
    .option("-h, --hub <hubSlug>", "the hub for the shift (please make sure that your user has all required permissions)")
    .option("-n, --badge <badgeNumber>", "Badge number for another user you want to schedule the shift for")

    .action((commandAndOptions) => {
        const {username, password, begin, end, hub, badge} = commandAndOptions;


        if (!username || !password) {
            console.error("Username and password are required!");
            return;
        }

        if (!hub) {
            console.error("Please pass hubSlug with -h option");
            return;
        }

        addShift(hub, badge, QuinyxShiftType.HQ_EMPLOYEE, username, password, begin, end)
            .catch(e => console.log(e));
    });

getReturns.argument("orderId").action((orderId) => {
    console.log(orderId);
    getOrderReturns(orderId).catch(e => console.log(e));
});

pickOrder
    .requiredOption("-h, --hub <hub_slug>", "the hub for the order")
    .requiredOption("-o, --order <order_number>", "order number for picking")
    .action((commandAndOptions) => {
        console.log(`Order number: ${commandAndOptions.order}`);
        pick(commandAndOptions.order, commandAndOptions.hub).catch(e => console.log(e));
    });

program
    .description("A CLI tool for order management")
    .version(getInstalledVersion(), '-v, --version', 'Output the current version')
    .showSuggestionAfterError(true)
    .allowUnknownOption()
    .option("create <arguments>", "Create an order with parameters or with default values")
    .addCommand(createOrder)
    .option("free <arguments>", "Cancel all orders in the hub to deal with 'Something went wrong: hub is closed right now' error")
    .addCommand(freeHub)
    .option("setup", "This command creates .env file with given or default CommerceTools credentials")
    .addCommand(setup)
    .option("cancel <value>", "Cancel by order name")
    .addCommand(cancelOrder)
    .option("defaults", "list defaults")
    .addCommand(deliverOrder)
    .option("deliver <orderId>", "Deliver the order")
    .option("add_shift", "Add a shift in Quinyx")
    .addCommand(addQuinyxShift)
    .option("delete_shifts", "Remove all shifts in the hub for the user in Quinyx")
    .addCommand(deleteAllQuinyxShifts)
    .option("get_returns <orderId>", "Get order refunds info from CT by order ID or name")
    .addCommand(getReturns)
    .option("pick", "Pick order id by order number and hub slug")
    .addCommand(pickOrder)
    .configureOutput({
        outputError: (str, write) => {
            console.error("Commander error:", str);
            write(str);
        },
    });

// parse args if it's not a test
if (!process.env.JEST_WORKER_ID) {
    program.parse(process.argv);
}

program.exitOverride((err) => {
    console.error("CLI exited unexpectedly:", err.message);
    throw err;
});