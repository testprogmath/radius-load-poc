#! /usr/bin/env node

import {Command} from "commander";
import create from "./commands/create";

const figlet = require("figlet");

console.log(figlet.textSync("Flinkord"));

const program = new Command();


export const createOrder = new Command("create");

createOrder
    .option("-h, --hub <hub_slug>", "the hub for the order", 'nl_ams_diem')
    .action((commandAndOptions) => {
        console.log(commandAndOptions);
        create('en-nl', commandAndOptions.hub).catch(e => console.log(e));
    });

program
    .version("1.0.0")
    .description("A CLI tool for order management")
    .showSuggestionAfterError(true)
    .option("create <arguments>", "Create an order with parameters or with default values")
    .addCommand(createOrder)
    .option("cancel <value>", "Cancel by order name")
    .option("defaults", "list defaults");


program.parse(process.argv);
const options = program.opts();
