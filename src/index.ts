#! /usr/bin/env node
import path from "path";

import {Command} from "commander";
import {create, free, setupEnv} from "./commands";

const figlet = require("figlet");
const gradient = require('gradient-string');


const rootDir = process.cwd();

const pkg = require(path.join(rootDir, 'package.json'));

console.log(gradient.rainbow(figlet.textSync("Flinkord")));

const program = new Command();


const createOrder = new Command("create");
const freeHub = new Command("free");

const setup = new Command("setup");

export {create} from "./commands/create";
export {free} from "./commands/free";
export {setupEnv} from "./commands/setup";

const isCLI = true;
createOrder
    .option("-h, --hub <hub_slug>", "the hub for the order")
    .option("-m, --email <email>", "the email to receive notifications about the order", "flinkordautotest@goflink.com")
    .action((commandAndOptions) => {
        console.log(commandAndOptions);
        create('en-fr', commandAndOptions.hub, commandAndOptions.email, isCLI).catch(e => console.log(e));
    });

freeHub
    .requiredOption("-h, --hub <hub_slug>", "the hub to open")
    .action((commandAndOptions) => {
        console.log(commandAndOptions);
        free(commandAndOptions.hub).catch(e => console.log(e));
    });

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
    .version(pkg.version);


if (require.main === module) {
    program.parse(process.argv);
}

