#! /usr/bin/env node

import {Command} from "commander";
import {create, free, deliver, setupEnv, addShift, deleteShifts} from "./commands";
import {CreateOptions} from "./commands/create";
import {cancel} from "./commands/cancel";
import {QuinyxShiftType} from "./shared/enums";

const figlet = require("figlet");
const gradient = require('gradient-string');


console.log(gradient.rainbow(figlet.textSync("Flinkord")));

const program = new Command();


const createOrder = new Command("create");
const freeHub = new Command("free");
const deliverOrder = new Command("deliver");
const cancelOrder = new Command("cancel");

const setup = new Command("setup");

const addQuinyxShift = new Command("add_shift");

const deleteAllQuinyxShifts = new Command("delete_shifts")

export {create} from "./commands/create";
export {free} from "./commands/free";
export {deliver} from "./commands/deliver";
export {cancel} from "./commands/cancel";
export {setupEnv} from "./commands/setup";
export {addShift} from "./commands/addShift"
export {deleteShifts} from "./commands/deleteShifts"

const isCLI = true;
createOrder
    .option("-h, --hub <hub_slug>", "the hub for the order")
    .option("-m, --email <email>", "the email to receive notifications about the order", "flinkordautotest@goflink.com")
    .option("-s, --shipping <clickAndCollect>", "a flag for clickAndCollect orders", "false")
    .option("-i, --instore", "a flag for in-store orders")
    .option("-d, --deliveryTag <tagValue>", "a delivery tag, possible values: outdoor, work, home, other")
    .option("-p, --products <products>", "products array in the format sku1:quantity1,sku2:quantity2")
    .action((commandAndOptions) => {
        console.log(commandAndOptions);
        const options: CreateOptions = {
            locale: 'en-fr',
            hubSlug: commandAndOptions.hub,
            email: commandAndOptions.email,
            clickAndCollect: commandAndOptions.shipping,
            isCLI: isCLI,
            inStore: commandAndOptions.instore !== undefined,
            deliveryTag: commandAndOptions.deliveryTag,
            productsArray: commandAndOptions.products
        };
        create(options).catch(e => console.log(e));
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

cancelOrder.argument("order").action(order=> {
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
        const { username, password, hub, badge } = commandAndOptions;


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
        const { username, password, begin, end, hub, badge } = commandAndOptions;


        if (!username || !password) {
            console.error("Username and password are required!");
            return;
        }

        if (!hub) {
            console.error("Please pass hubSlug with -h option");
            return;
        }

        addShift(hub, badge, QuinyxShiftType.OPS_ASSOCIATE, username, password, begin, end)
            .catch(e => console.log(e));
    });


program
    .description("A CLI tool for order management")
    .showSuggestionAfterError(true)
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
    .addCommand(deleteAllQuinyxShifts);

if (require.main === module) {
    program.parse(process.argv);
}

