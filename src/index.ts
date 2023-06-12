#! /usr/bin/env node

import {Command} from "commander";
import {create, free, deliver, setupEnv} from "./commands";
import {CreateOptions} from "./commands/create";

const figlet = require("figlet");
const gradient = require('gradient-string');


console.log(gradient.rainbow(figlet.textSync("Flinkord")));

const program = new Command();


const createOrder = new Command("create");
const freeHub = new Command("free");
const deliverOrder = new Command("deliver");

const setup = new Command("setup");

export {create} from "./commands/create";
export {free} from "./commands/free";
export {setupEnv} from "./commands/setup";

const isCLI = true;
createOrder
    .option("-h, --hub <hub_slug>", "the hub for the order")
    .option("-m, --email <email>", "the email to receive notifications about the order", "flinkordautotest@goflink.com")
    .option("-s, --shipping <clickAndCollect>", "a flag for clickAndCollect orders", "false")
    .option("-i, --instore", "a flag for in-store orders")
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
})
setup
    .action(() => {
        setupEnv().catch(e => console.log(e));
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
    .option("defaults", "list defaults")
    .addCommand(deliverOrder)
    .option("deliver <orderId>", "Deliver the order");

if (require.main === module) {
    program.parse(process.argv);
}

