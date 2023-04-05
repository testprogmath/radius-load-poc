#! /usr/bin/env node

import {Command} from "commander";
import create from "./commands/create";

const figlet = require("figlet");

console.log(figlet.textSync("Flinkord"));

const program = new Command();
export const createOrder = new Command("create");

createOrder.action(() => {
    create('en-nl', 'nl_ams_diem');
});

program
    .version("1.0.0")
    .description("A CLI tool for order management")
    .option("create <arguments>", "Create an order with parameters or with default values")
    .addCommand(createOrder)
    .option("cancel <value>", "Cancel by order name")
    .option("defaults", "list defaults")
    .parse(process.argv);

const options = program.opts();
