import {Colors, QuinyxShiftType} from "../shared/enums";
import { QuinyxApi} from "../api/quinyx-api";
import {hubMap} from "../utils/hub";
import {spinnerError, spinnerSuccess, updateSpinnerText} from "../spinner";
import chalk from "chalk";

const emojic = require("emojic");

export async function addShift(hubSlug: string, badgeNumber: string, shiftType: QuinyxShiftType, username: string, password: string, beginDateTime?: string, endDateTime?: string, isCLI = true) {
    const quinyxApi = new QuinyxApi();

    console.log("🚀 Starting to create a new shift...");
    updateSpinnerText(chalk.hex(Colors.MEXICAN_PINK_DARK)("Processing.... \n"), true);
    const hub = hubMap[hubSlug.toLowerCase()];
    if (!hub) {
        console.error("Invalid hub specified! If you're sure that the hub is correct, contact the author to add your hub to the list.");
        return;
    }
    try {
        await quinyxApi.userLogin(username, password);
        await quinyxApi.getGroups();

        let beginDate: Date;
        let endDate: Date;

        if (beginDateTime) {
            beginDate = new Date(beginDateTime);
        } else {
            beginDate = new Date();
            beginDate.setHours(8, 0, 0);
        }

        if (endDateTime) {
            endDate = new Date(endDateTime);
        } else {
            endDate = new Date();
            endDate.setHours(23, 59, 0);
        }

        const result = await quinyxApi.createShift(hub.id, beginDate, endDate, shiftType);

        if (isCLI) spinnerSuccess("🚀 The shift successfully created!");
        const { begin, end } = result;
        console.log(`${emojic.calendar} ${chalk.hex(Colors.LAVENDER_PINK).bold("Shift Details")} ${emojic.calendar}`);
        console.log(`Begin Time: ${chalk.hex(Colors.THULIAN_PINK).bold(begin)}`)
        console.log(`End Time: ${chalk.hex(Colors.THULIAN_PINK).bold(end)}`)

        const employee = await quinyxApi.findEmployee(username, hub.id);

        console.log('-----------------------------------------------------------------------------------------');


        console.log(chalk.hex(Colors.MEXICAN_PINK)("First Name: ").padEnd(15) + chalk.hex(Colors.WHITE)((employee.firstName ? employee.firstName : 'N/A')));
        console.log(chalk.hex(Colors.LAVENDER_PINK)("Last Name: ").padEnd(15) + chalk.hex(Colors.WHITE)((employee.lastName ? employee.lastName : 'N/A')));
        console.log(chalk.hex(Colors.THULIAN_PINK)("Email: ").padEnd(15) + chalk.hex(Colors.WHITE)((employee.email ? employee.email : 'N/A')));
        console.log(chalk.hex(Colors.MEXICAN_PINK_DARK)("Badge Number: ").padEnd(15) + chalk.hex(Colors.WHITE)((employee.badgeNumber ? employee.badgeNumber : 'N/A')));

    } catch (error) {
        console.error("Oops, something went wrong:", error);
        spinnerError("Your request failed. Please find the stacktrace above");
    }
}
