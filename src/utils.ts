import path from "path";
import * as fs from "fs";
import {Product} from "./api/catalog-api";
import {promisify} from "util";
import {mkdir} from "fs/promises";

const findUp = require('find-up');
const readJsonFile = promisify(fs.readFile);
const writeJsonFile = promisify(fs.writeFile);

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

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


export async function readCacheFile(hubSlug: string): Promise<Product[]> {
    const filePath = path.join('resources', 'cache', `${hubSlug}.json`);
    try {
        const fileContent = await readJsonFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

export async function writeCacheFile(hubSlug: string, products: Product[]): Promise<void> {
    const dirPath = path.join('resources', 'cache');
    const filePath = path.join(dirPath,`${hubSlug}.json`);
    try {
        await mkdir(dirPath, { recursive: true });
        const jsonContent = JSON.stringify(products, (key, value) => {
            if (value === null || value === undefined || value === '') {
                return undefined;
            }
            return value;
        }, 2);
        await writeJsonFile(filePath, jsonContent, 'utf-8');
    } catch (error) {
        console.error('Error writing cache file:', error);
    }
}


