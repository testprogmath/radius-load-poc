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
    console.error(e);
    spinnerError("Your request failed. Please find the stacktrace above");
    stopSpinner();
    throw new Error(e.message || "An unknown error occurred");
}