import fs from "fs";
import path from "path";
import os from "os";
import dotenv from "dotenv";
dotenv.config({ override: true });
import merge from "lodash.merge";

const defaultConfigPath = process.env.DEFAULT_CONFIG_PATH ?? path.resolve("config", "default.json");
const defaultUserConfigPath = path.join(os.homedir(), ".flinkord", "config.json");

const QUINYX_KEYS = [
    "quinyxHub",
    "quinyxBadge",
    "quinyxEmail",
    "quinyxPassword",
    "quinyxIsCli",
];

function toSnakeCase(camel: string): string {
    return camel.replace(/[A-Z]/g, letter => `_${letter}`).toUpperCase();
}

function loadJson(filePath: string): Record<string, any> {
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch {
        return {};
    }
}

function resolveConfigPath(provided?: string): string {
    if (!provided) return defaultUserConfigPath;
    return path.isAbsolute(provided) ? provided : path.resolve(provided);
}

function isUpperSnakeCase(key: string): boolean {
    return /^[A-Z0-9_]+$/.test(key);
}

function envOverridesFromConfigKeys(config: Record<string, any>): Record<string, any> {
    const overrides: Record<string, any> = {};

    for (const key of Object.keys(config)) {
        if (QUINYX_KEYS.includes(key)) continue;

        const envValue = process.env[key] ?? process.env[isUpperSnakeCase(key) ? key : toSnakeCase(key)];

        if (envValue !== undefined) {
            overrides[key] = envValue;
        }
    }

    return overrides;
}

function quinyxEnvOverrides(): Record<string, any> {
    const result: Record<string, any> = {};

    for (const key of QUINYX_KEYS) {
        const envValue = process.env[key] ?? process.env[isUpperSnakeCase(key) ? key : toSnakeCase(key)];
        if (envValue !== undefined) {
            result[key] = inferType(envValue);
        }
    }

    return result;
}

function inferType(value: string): string | boolean {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
}

export function loadMergedConfig(cliPath?: string): Record<string, any> {
    const defaultConfig = loadJson(defaultConfigPath);
    const userConfig = loadJson(resolveConfigPath(cliPath ?? process.env.CONFIG_PATH));

    const envOverrides = envOverridesFromConfigKeys({ ...defaultConfig, ...userConfig });
    const quinyxOverrides = quinyxEnvOverrides();
    const final = merge({}, defaultConfig, userConfig, envOverrides, quinyxOverrides);
    exportToEnv(final);
    return final;
}

// Export config keys to process.env, but do not override existing environment variables (ENV has priority)
export function exportToEnv(config: Record<string, any>): void {
    for (const [key, value] of Object.entries(config)) {
        const envKey = isUpperSnakeCase(key) ? key : toSnakeCase(key);
        if (!process.env[envKey]) {
            process.env[envKey] = String(value);
        }
    }
}
