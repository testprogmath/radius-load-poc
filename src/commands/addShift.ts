import { Colors, QuinyxShiftType } from "../shared/enums.js";
import { QuinyxApi } from "../api/quinyx-api.js";
import { hubMap } from "../utils/hub.js";
import { spinnerError, spinnerSuccess, updateSpinnerText } from "../spinner.js";
import chalk from "chalk";
import { AxiosError } from "axios";
//@ts-ignore
import emojic from "emojic";

interface ShiftDetails {
    begin: string;
    end: string;
}

interface EmployeeDetails {
    firstName: string;
    lastName: string;
    email: string;
    badgeNumber: string;
}

function formatDateTime(dateTime?: string, defaultHour?: number, defaultMinute?: number): Date {
    if (dateTime) {
        return new Date(dateTime);
    }
    const date = new Date();
    date.setHours(defaultHour || 0, defaultMinute || 0, 0);
    return date;
}

function printEmployeeDetails(employee: EmployeeDetails): void {
    const details = [
        { label: "First Name", value: employee.firstName, color: Colors.MEXICAN_PINK },
        { label: "Last Name", value: employee.lastName, color: Colors.LAVENDER_PINK },
        { label: "Email", value: employee.email, color: Colors.THULIAN_PINK },
        { label: "Badge Number", value: employee.badgeNumber, color: Colors.MEXICAN_PINK_DARK }
    ];

    console.log("-----------------------------------------------------------------------------------------");
    details.forEach(({ label, value, color }) => {
        console.log(chalk.hex(color)(`${label}:`).padEnd(15) + chalk.hex(Colors.WHITE)(value || "N/A"));
    });
}

function handleAxiosError(error: AxiosError): void {
    console.error("Oops, something went wrong:", error.message);
    console.error("Response:", error.response?.data);
}

export async function addShift(
    hubSlug: string,
    badgeNumber: string,
    shiftType: QuinyxShiftType,
    username: string,
    password: string,
    isCLI = true,
    beginDateTime?: string,
    endDateTime?: string
): Promise<ShiftDetails | undefined> {
    const quinyxApi = new QuinyxApi();

    console.log("🚀 Starting to create a new shift...");
    if (isCLI) updateSpinnerText("Processing....", true);

    const hub = hubMap[hubSlug.toLowerCase()];
    if (!hub) {
        console.error("Invalid hub specified! If you're sure that the hub is correct, contact the author to add your hub to the list.");
        return;
    }

    try {
        await quinyxApi.userLogin(username, password);
        await quinyxApi.getGroups();

        const beginDate = formatDateTime(beginDateTime, 8, 0);
        const endDate = formatDateTime(endDateTime, 23, 59);

        const result = await quinyxApi.createShift(hub.id, beginDate, endDate, shiftType);

        if (isCLI) spinnerSuccess("🚀 The shift successfully created!");
        const { begin, end } = result;
        console.log(`${emojic.calendar} ${chalk.hex(Colors.LAVENDER_PINK).bold("Shift Details")} ${emojic.calendar}`);
        console.log(`Begin Time: ${chalk.hex(Colors.THULIAN_PINK).bold(begin)}`);
        console.log(`End Time: ${chalk.hex(Colors.THULIAN_PINK).bold(end)}`);

        const employee = await quinyxApi.findEmployee(username, hub.id);
        printEmployeeDetails(employee);

        return { begin, end };
    } catch (error) {
        if (error instanceof AxiosError) {
            handleAxiosError(error);
        } else {
            console.error("Oops, something went wrong:", error);
        }
        spinnerError("Your request failed. Please find the stacktrace above");
    }
}