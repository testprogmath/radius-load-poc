import {spinnerError, stopSpinner} from "./spinner";
import {program} from "commander";


export function printErrorAndStopSpinner(e: any) {
    console.log(e);
    spinnerError("Your request failed. Please find the stacktrace above");
    stopSpinner();
    program.error('', {exitCode: 1});
}