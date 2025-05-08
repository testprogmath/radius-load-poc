import {Colors, QuinyxGroup} from "../shared/enums.js";
import {QuinyxApi} from "../api/quinyx-api.js";
import {hubMap} from "../utils/hub.js";
import {spinnerError, spinnerSuccess, updateSpinnerText} from "../spinner.js";
import chalk from "chalk";
// @ts-ignore
import emojic from "emojic"


export async function deleteShifts(hubSlug: string, badgeNumber: string, username: string, password: string, isCLI = true) {
    const quinyxApi = new QuinyxApi();
    let quinyxGroupValue: number | undefined;
    if (hubSlug.toUpperCase() in QuinyxGroup) {
        console.log(hubSlug.toUpperCase());
        // @ts-ignore
        quinyxGroupValue = QuinyxGroup[hubSlug.toUpperCase()];
        console.log(`${emojic.calendar} ${chalk.hex(Colors.LAVENDER_PINK).bold("Group number is " + quinyxGroupValue)} ${emojic.calendar}`);

        console.log(quinyxGroupValue);
    } else {
        console.error("Invalid group specified! If you're sure that the group is correct, contact the author to add your group to the list.");
        return;
    }


    console.log("🚀 Starting to delete shifts...");
    if (isCLI) updateSpinnerText("Processing....", true);
    const hub = hubMap[hubSlug.toLowerCase()];
    if (!hub) {
        console.error("Invalid hub specified! If you're sure that the hub is correct, contact the author to add your hub to the list.");
        return;
    }
    try {
        await quinyxApi.userLogin(username, password);
        console.log("Login successful!")
        // @ts-ignore
        const result = await quinyxApi.getAllShiftsByDateForUser(quinyxGroupValue, new Date());
        await Promise.all(result.map((shiftId: number) => quinyxApi.deleteShift(shiftId, quinyxGroupValue!)));


        if (isCLI) spinnerSuccess(`All shifts for ${hubSlug} have been removed!`);

        console.log(`${emojic.calendar} ${chalk.hex(Colors.LAVENDER_PINK).bold("All shifts for " + hubSlug + " have been removed")} ${emojic.calendar}`);

    } catch (error) {
        console.error("Oops, something went wrong:", error);
        if (isCLI) spinnerError("Your request failed. Please find the stacktrace above");
    }
}
