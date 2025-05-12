import * as path from "path";
import { promises as fs } from "fs";
import {findUp} from "find-up";
// @ts-ignore
import jsonfile from "jsonfile";
import {AppConfig} from "./config.js";
import {fileURLToPath} from "url";

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getConfigFilePath(): Promise<string> {
    const currentDir = process.cwd();
    const configPath = path.join(currentDir, "config/config.json");

    try {
        await fs.access(configPath, fs.constants.F_OK);
        console.log(`Using local config: ${configPath}`);
        return configPath;
    } catch {
        const resolvedConfigPath = await findUp("config/default.json", {cwd: __dirname});
        if (!resolvedConfigPath) {
            throw new Error("No configuration file found");
        }
        return resolvedConfigPath;
    }
}

export async function readAppConfig(): Promise<AppConfig> {
    const configPath = await getConfigFilePath();
    return await jsonfile.readFile(configPath) as Promise<AppConfig>;
}

export const wait = (ms: number) => new Promise(resolve => {
    setTimeout(resolve, ms);
});