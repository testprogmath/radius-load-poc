import chalk from "chalk";
import cliSpinners from 'cli-spinners';
import {Colors} from "./shared/enums.js";

const spinnerFrames = cliSpinners.dots.frames;
let spinnerIndex = 0;
let spinnerInterval: NodeJS.Timeout | null = null;
let currentText = "";

export const startSpinner = (text: string) => {
    currentText = text;
    if (spinnerInterval) clearInterval(spinnerInterval);
    spinnerInterval = setInterval(() => {
        const frame = spinnerFrames[spinnerIndex = (spinnerIndex + 1) % spinnerFrames.length];
        process.stdout.write(`\r${frame} ${currentText}`);
    }, cliSpinners.dots.interval);
};

export const updateSpinnerText = (text: string, isCLI = false) => {
    if (isCLI) {
        currentText = chalk.hex(Colors.MEXICAN_PINK_DARK)(`${text}`);
    }
};

export const stopSpinner = () => {
    if (spinnerInterval) {
        clearInterval(spinnerInterval);
        spinnerInterval = null;
        process.stdout.write('\r');
    }
};

export const spinnerSuccess = (message?: string) => {
    stopSpinner();
    console.log(`✅ ${message || "Done"}`);
};

export const spinnerError = (message?: string) => {
    stopSpinner();
    console.error(`❌ ${message || "Error"}`);
};

export function printErrorAndStopSpinner(e: any) {
    stopSpinner();
    
    // Handle specific error types with user-friendly messages
    if (e.response?.data?.message) {
        // API error with message
        spinnerError(`Request failed: ${e.response.data.message}`);
    } else if (e.response?.status === 400) {
        // Bad request - likely invalid hub or input data
        spinnerError("Invalid request. Please check your hub name and input data.");
    } else if (e.response?.status === 404) {
        // Not found - hub doesn't exist
        spinnerError("Hub not found. Please check the hub name and try again.");
    } else if (e.message?.includes("Hub information for")) {
        // Hub not found in auth0
        spinnerError("Hub not found. Please check the hub name and try again.");
    } else if (e.message) {
        // Generic error with message
        spinnerError(`Error: ${e.message}`);
    } else {
        // Unknown error - show minimal info
        spinnerError("Request failed. Please check your input and try again.");
    }
    
    throw new Error(e.message || "An unknown error occurred");
}