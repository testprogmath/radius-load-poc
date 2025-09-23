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
    
    // Log the full error for debugging (but only in development or if verbose)
    if (process.env.DEBUG || process.env.NODE_ENV === 'development') {
        console.error("Full error details:", JSON.stringify(e, null, 2));
    }
    
    // Special handling for Axios errors to show response data
    if (e.response?.data) {
        console.error("API Response:", JSON.stringify(e.response.data, null, 2));
    }
    
    // Handle specific error types with user-friendly messages
    if (e.response?.data?.message) {
        // API error with message
        spinnerError(`Request failed: ${e.response.data.message}`);
    } else if (e.response?.data) {
        // API error with data but no message
        const responseData = JSON.stringify(e.response.data, null, 2);
        spinnerError(`Request failed with status ${e.response.status}. Response: ${responseData}`);
    } else if (e.response?.status === 400) {
        // Bad request - likely invalid hub or input data
        spinnerError("Invalid request (400). Please check your hub name and input data.");
    } else if (e.response?.status === 404) {
        // Not found - hub doesn't exist
        spinnerError("Hub not found (404). Please check the hub name and try again.");
    } else if (e.response?.status) {
        // Other HTTP error
        spinnerError(`Request failed with status ${e.response.status}.`);
    } else if (e.message?.includes("Hub information for")) {
        // Hub not found in auth0
        spinnerError("Hub not found. Please check the hub name and try again.");
    } else if (e.message?.includes("HTTP error! Status:")) {
        // HTTP error with response body
        spinnerError(`Error: ${e.message}`);
    } else if (e.message === "update_error") {
        // Special case for inventory update errors
        spinnerError("Error updating inventory. This may be due to invalid products or insufficient permissions.");
    } else if (e.message) {
        // Generic error with message
        spinnerError(`Error: ${e.message}`);
    } else {
        // Unknown error - show minimal info
        spinnerError("Request failed. Please check your input and try again.");
    }
    
    throw new Error(e.message || "An unknown error occurred");
}