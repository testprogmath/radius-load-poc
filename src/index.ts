#! /usr/bin/env node

import {Command} from "commander";
import create from "./commands/create";
import path from "path";

const figlet = require("figlet");
const gradient = require('gradient-string');

const pkg = require(path.join(__dirname, '..','package.json'));

console.log(gradient.rainbow(figlet.textSync("Flinkord")));

const program = new Command();


export const createOrder = new Command("create");

createOrder
    .option("-h, --hub <hub_slug>", "the hub for the order")
    .option("-m, --email <email>", "the email to receive notifications about the order", "flinkordautotest@goflink.com")
    .action((commandAndOptions) => {
        console.log(commandAndOptions);
        create('en-fr', commandAndOptions.hub, commandAndOptions.email).catch(e => console.log(e));
    });


program
    .version(pkg.version)
    .description("A CLI tool for order management")
    .showSuggestionAfterError(true)
    .option("create <arguments>", "Create an order with parameters or with default values")
    .addCommand(createOrder)
    .option("cancel <value>", "Cancel by order name")
    .option("defaults", "list defaults");


program.parse(process.argv);



