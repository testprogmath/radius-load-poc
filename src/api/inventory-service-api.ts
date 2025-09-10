import * as dotenv from "dotenv";
dotenv.config({ override: true, quiet: true });

import { readAppConfig} from "../utils.js";
import {DEFAULT_PRODUCTS_NUMBER} from "../utils/constants.js";
import {AppConfig} from "../config.js";

let config: AppConfig;
let INVENTORY_SERVICE_URL: string;

let isInitialized = false;

async function ensureInitialized() {
    if (!isInitialized) {
        await initializeConfig();
        isInitialized = true;
    }
}

export async function initializeConfig() {
    config = await readAppConfig();

    INVENTORY_SERVICE_URL = config.inventoryServiceUrl ?? "";
}

async function getAuthToken(): Promise<string> {
    const token = process.env.INVENTORY_SERVICE_TOKEN;
    if (!token) {
        throw new Error("Missing INVENTORY_SERVICE_TOKEN in environment variables");
    }
    return token;
}

export async function getItemStockInHub(sku: string, hubSlug: string) {
    await ensureInitialized();

    const token = await getAuthToken();
    const url = `${INVENTORY_SERVICE_URL}/v1/inventory?skus=${sku}&hubSlugs=${hubSlug}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching stock:", error);
    }
}

export async function updateStockInTheHub(sku: string, hubSlug: string, amount: number, reason = "INVENTORY_CHANGE_REASON_CORRECTION") {
    await ensureInitialized();

    const token = await getAuthToken();
    const url = `${INVENTORY_SERVICE_URL}/v1/inventory/hub/${hubSlug}/sku/${sku}`;
    const data = {
        actor: {id: "flinkord"},
        amount,
        reason
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`HTTP error! Status: ${response.status}, Body: ${JSON.stringify(errorBody)}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating stock:", error);
        return null;
    }
}

export async function getInventoryChangesForTheHub(hubSlug: string, numberOfItems: number = DEFAULT_PRODUCTS_NUMBER, dateFrom?: string, dateTo?: string) {
    await ensureInitialized();

    const token = await getAuthToken();
    const currentDate = new Date();
    const twoMonthsAgo = new Date(currentDate);
    twoMonthsAgo.setDate(currentDate.getDate() - 60);

    const formattedDateTo = dateTo ?? currentDate.toISOString();
    const formattedDateFrom = dateFrom ?? twoMonthsAgo.toISOString();

    const url = `${INVENTORY_SERVICE_URL}/v1/inventory/logs?hub_slugs=${hubSlug}&date_from=${encodeURIComponent(formattedDateFrom)}&date_to=${encodeURIComponent(formattedDateTo)}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const uniqueSkus = Array.from(new Set(data.results.map((entry: any) => entry.sku)));

        return uniqueSkus.slice(0, numberOfItems);
    } catch (error) {
        console.error("Error fetching inventory changes:", error);
        return [];
    }
}
