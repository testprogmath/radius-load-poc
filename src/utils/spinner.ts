import {spinnerError, stopSpinner} from "../spinner.js";
import {program} from "commander";

export function printErrorAndStopSpinner(e: any) {
    console.error(e);
    spinnerError("Your request failed. Please find the stacktrace above");
    stopSpinner();
    throw new Error(e.message || "An unknown error occurred");
}