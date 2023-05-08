import {spinnerError, stopSpinner} from "./spinner";
import {program} from "commander";
import path from "path";
import * as fs from "fs";

const findUp = require('find-up');

export function printErrorAndStopSpinner(e: any) {
    console.log(e);
    spinnerError("Your request failed. Please find the stacktrace above");
    stopSpinner();
    program.error('', {exitCode: 1});
}

export function getConfigPath() {
    const currentDir = process.cwd();
    const configPath = path.join(currentDir, 'config');
    if (fs.existsSync(configPath)) {
        process.env.NODE_CONFIG_DIR = configPath;
        return require('config');
    }
    const flinkordCliPath = path.dirname(require.resolve('@flink/flinkord-cli'));
    const resolvedConfigPath = findUp.sync('config', {cwd: flinkordCliPath});
    if (!resolvedConfigPath) {
        console.error('No configurations found in configuration directory');
        process.exit(1);
    }
    process.env.NODE_CONFIG_DIR = resolvedConfigPath;
    return require('config');
}