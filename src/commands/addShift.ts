import { Colors, QuinyxShiftType } from "../shared/enums.js";
import { QuinyxApi } from "../api/quinyx-api.js";
import { hubMap } from "../utils/hub.js";
import { spinnerError, spinnerSuccess, updateSpinnerText } from "../spinner.js";
import chalk from "chalk";
import { AxiosError } from "axios";
//@ts-ignore
import emojic from "emojic";
import {printEmployeeDetails} from "../utils/output.js";

interface ShiftDetails {
    begin: string;
    end: string;
}

function formatDateTime(dateTime?: string, defaultHour?: number, defaultMinute?: number): Date {
    if (dateTime) {
        return new Date(dateTime);
    }
    const date = new Date();
    date.setHours(defaultHour ?? 0, defaultMinute ?? 0, 0);
    return date;
}

function handleAxiosError(error: AxiosError): void {
    console.error("Oops, something went wrong:", error.message);
    console.error("Response:", error.response?.data);
}

export async function addShift(
    hubSlug?: string,
    shiftType?: QuinyxShiftType,
    managerUsername?: string,
    managerPassword?: string,
    employeeSelector?: string,
    isCLI = true,
    beginDateTime?: string,
    endDateTime?: string,
): Promise<ShiftDetails | undefined> {
    // fallback to ENV if any param is missing
    hubSlug ??= process.env.quinyxHub ?? process.env.QUINYX_HUB;
    managerUsername ??= process.env.quinyxEmail ?? process.env.QUINYX_EMAIL;
    managerPassword ??= process.env.quinyxPassword ?? process.env.QUINYX_PASSWORD;

    const rawIsCli = process.env.quinyxIsCli ?? process.env.QUINYX_IS_CLI;
    if (typeof isCLI === "undefined" && rawIsCli !== undefined) {
        isCLI = rawIsCli === "true";
    }

    const quinyxApi = new QuinyxApi();

    console.log("🚀 Starting to create a new shift...");
    if (isCLI) updateSpinnerText("Processing....", true);

    const hub = hubMap[hubSlug?.toLowerCase() ?? ""];
    if (!hub) {
        console.error("❌ Invalid hub specified! If you're sure the hub is correct, contact the author.");
        return;
    }

    if (!employeeSelector) {
        console.error("❌ Missing badge number. Please provide -n [badge number]");
        return;
    }

    try {
        await quinyxApi.userLogin(managerUsername!, managerPassword!);
        await quinyxApi.getGroups();

        const beginDate = formatDateTime(beginDateTime, 8, 0);
        const endDate = formatDateTime(endDateTime, 23, 59);


        const employee = await quinyxApi.findEmployee(employeeSelector, hub.id);
        const employeeData =  quinyxApi.parseEmployeeInfo(employee);

        const result = await quinyxApi.createShift(hub.id, beginDate, endDate, shiftType!, employeeData.employeeId, employeeData.agreementId);

        if (isCLI) spinnerSuccess("🚀 The shift successfully created!");
        const { begin, end } = result;

        console.log(`${emojic.calendar} ${chalk.hex(Colors.LAVENDER_PINK).bold("Shift Details")} ${emojic.calendar}`);
        console.log(`Begin Time: ${chalk.hex(Colors.THULIAN_PINK).bold(begin)}`);
        console.log(`End Time: ${chalk.hex(Colors.THULIAN_PINK).bold(end)}`);

        printEmployeeDetails(employee);

        return { begin, end };
    } catch (error) {
        if (error instanceof AxiosError) {
            handleAxiosError(error);
        } else {
            console.error("Oops, something went wrong:", error);
        }
        spinnerError("❌ Your request failed. Please find the stacktrace above");
    }
}
