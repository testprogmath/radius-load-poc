import { Colors, QuinyxGroup } from "../shared/enums.js";
import { QuinyxApi } from "../api/quinyx-api.js";
import { hubMap } from "../utils/hub.js";
import { spinnerError, spinnerSuccess, updateSpinnerText } from "../spinner.js";
import chalk from "chalk";
// @ts-ignore
import emojic from "emojic";
import { loadMergedConfig } from "../loadMergedConfig.js";

export async function deleteShifts(
    hubSlug?: string,
    badgeNumber?: string,
    username?: string,
    password?: string,
    isCLI?: boolean
) {
    const config = loadMergedConfig();

    hubSlug ??= process.env.quinyxHub ?? process.env.QUINYX_HUB ?? config.quinyxHub;
    badgeNumber ??= process.env.quinyxBadge ?? process.env.QUINYX_BADGE ?? config.quinyxBadge;
    username ??= process.env.quinyxEmail ?? process.env.QUINYX_EMAIL ?? config.quinyxEmail;
    password ??= process.env.quinyxPassword ?? process.env.QUINYX_PASSWORD ?? config.quinyxPassword;

    const rawIsCli = process.env.quinyxIsCli ?? process.env.QUINYX_IS_CLI;
    if (typeof isCLI === "undefined") {
        isCLI = rawIsCli !== undefined ? rawIsCli === "true" : config.quinyxIsCli !== false;
    }

    const missing: string[] = [];
    if (!hubSlug) missing.push("quinyxHub");
    if (!badgeNumber) missing.push("quinyxBadge");
    if (!username) missing.push("quinyxEmail");
    if (!password) missing.push("quinyxPassword");

    if (missing.length > 0) {
        console.error(`❌ Missing required configuration: ${missing.join(", ")}`);
        console.error("Provide them via arguments, config file, or environment variables.");
        return;
    }

    hubSlug = hubSlug!;
    username = username!;
    password = password!;

    const quinyxApi = new QuinyxApi();

    let quinyxGroupValue: number | undefined;
    if (hubSlug.toUpperCase() in QuinyxGroup) {
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

    try {
        await quinyxApi.userLogin(username, password);
        console.log("✅ Login successful!");

        const result = await quinyxApi.getAllShiftsByDateForUser(quinyxGroupValue, new Date());
        await Promise.all(result.map((shiftId: number) => quinyxApi.deleteShift(shiftId, quinyxGroupValue!)));

        if (isCLI) spinnerSuccess(`✅ All shifts for ${hubSlug} have been removed!`);
        console.log(`${emojic.calendar} ${chalk.hex(Colors.LAVENDER_PINK).bold("All shifts for " + hubSlug + " have been removed")} ${emojic.calendar}`);
    } catch (error) {
        console.error("❌ Something went wrong:", error);
        if (isCLI) spinnerError("Your request failed. Please find the stacktrace above");
    }
}