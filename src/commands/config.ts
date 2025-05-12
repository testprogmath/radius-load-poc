// print-config.ts
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { getConfigFilePath } from "../utils.js";
import { loadMergedConfig } from "../loadMergedConfig.js";

export async function printConfig(): Promise<void> {
    try {
        const configPath = await getConfigFilePath();
        const mergedConfig = loadMergedConfig(configPath);
        const userConfigPath = path.join(os.homedir(), ".flinkord", "config.json");

        const homeDir = os.homedir();
        const envPath = path.join(homeDir, ".env");
        let parsedEnv: Record<string, string> = {};

        if (fs.existsSync(envPath)) {
            const raw = fs.readFileSync(envPath, "utf-8");
            parsedEnv = Object.fromEntries(
                raw
                    .split("\n")
                    .map(line => line.trim())
                    .filter(line => line && !line.startsWith("#"))
                    .map(line => {
                        const [key, ...valParts] = line.split("=");
                        const value = valParts.join("=").trim().replace(/(^"|"$)/g, "");
                        return [key.trim(), value];
                    })
            );
        }

        const maskValue = (value: string) =>
            value.length > 8 ? value.slice(0, 4) + "..." + value.slice(-4) : "***";

        const maskedEnv = Object.fromEntries(
            Object.entries(parsedEnv).map(([key, value]) =>
                key.toLowerCase().includes("key") ||
                key.toLowerCase().includes("token") ||
                key.toLowerCase().includes("secret") ||
                key.toLowerCase().includes("password")
                    ? [key, maskValue(value)]
                    : [key, value]
            )
        );

        console.log("Current configuration:");
        console.log("Default config path:", configPath);
        console.log("User config path:", userConfigPath);
        console.dir({ mergedConfig, env: maskedEnv }, { depth: null, colors: true });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Failed to load configuration:", error.message);
        } else {
            console.error("Unknown error occurred while loading configuration");
        }
        process.exit(1);
    }
}