import { Colors, QuinyxGroup } from "../shared/enums.js";
import { QuinyxApi } from "../api/quinyx-api.js";
import { hubMap } from "../utils/hub.js";
import { spinnerError, spinnerSuccess, updateSpinnerText } from "../spinner.js";
import chalk from "chalk";
// @ts-ignore
import emojic from "emojic";
import { loadMergedConfig } from "../loadMergedConfig.js";
import {printEmployeeDetails} from "../utils/output.js";
import {AxiosError} from "axios";
import {handleAxiosError} from "../utils/errors.js";

export async function deleteShifts(
    hubSlug?: string,
    managerUsername?: string,
    managerPassword?: string,
    employeeSelector?: string,
    isCLI = true,
    shiftId?: string,
) {
    const config = loadMergedConfig();

    hubSlug ??= process.env.quinyxHub ?? process.env.QUINYX_HUB;
    managerUsername ??= process.env.quinyxEmail ?? process.env.QUINYX_EMAIL;
    managerPassword ??= process.env.quinyxPassword ?? process.env.QUINYX_PASSWORD;

    const rawIsCli = process.env.quinyxIsCli ?? process.env.QUINYX_IS_CLI;
    if (typeof isCLI === "undefined") {
        isCLI = rawIsCli !== undefined ? rawIsCli === "true" : config.quinyxIsCli !== false;
    }

    const quinyxApi = new QuinyxApi();

    let quinyxGroupValue: number | undefined;
    if (hubSlug && hubSlug.toUpperCase() in QuinyxGroup) {
        quinyxGroupValue = QuinyxGroup[hubSlug.toUpperCase() as keyof typeof QuinyxGroup];
        console.log(`${emojic.calendar} ${chalk.hex(Colors.LAVENDER_PINK).bold("Group number is " + quinyxGroupValue)} ${emojic.calendar}`);
    } else {
        console.error("❌ Invalid group specified! Please check hub name or contact the author.");
        return;
    }

    console.log("🚀 Starting to delete shifts...");
    if (isCLI) updateSpinnerText("Processing....", true);

    const hub = hubMap[hubSlug.toLowerCase()];
    if (!hub) {
        console.error("❌ Invalid hub specified! Please check spelling or contact the author.");
        return;
    }

    if (!employeeSelector) {
        console.error("❌ Missing badge number. Please provide -n [badge number]");
        return;
    }

try {
    console.log(`USERNAME: ${managerUsername}`);
    console.log(`PASSWORD: ${managerPassword}`);
        await quinyxApi.userLogin(managerUsername!, managerPassword!);
        await quinyxApi.getGroups();

        const employee = await quinyxApi.findEmployee(employeeSelector, hub.id);
        const employeeData = quinyxApi.parseEmployeeInfo(employee);

        const shifts = await quinyxApi.getAllShiftsByDateForUser(hub.id, employeeData.employeeId);

        if (!shifts || shifts.length === 0) {
            console.error("❌ No shifts found for this employee.");
            return false;
        }

        const shiftToDelete = shiftId
            ? shifts.find((s: any) => s.id === shiftId)
            : shifts[0];

        if (!shiftToDelete) {
            console.error("❌ Shift not found.");
            return false;
        }

        await quinyxApi.deleteShift(shiftToDelete, hub.id);

        if (isCLI) spinnerSuccess("🗑️ The shift was successfully deleted!");

        console.log(`${emojic.calendar} ${chalk.hex(Colors.LAVENDER_PINK).bold("Deleted Shift")} ${emojic.calendar}`);
        console.log(`Shift ID: ${chalk.hex(Colors.THULIAN_PINK).bold(shiftToDelete.id)}`);

        printEmployeeDetails(employee);

        return true;
    } catch (error) {
        if (error instanceof AxiosError) {
            handleAxiosError(error);
        } else {
            console.error("Oops, something went wrong:", error);
        }
        spinnerError("❌ Your request failed. Please find the stacktrace above");
    }
}