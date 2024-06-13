import {getConfigPath} from "../utils";

const config = getConfigPath();
const INVENTORY_SERVICE_URL = config.get("inventoryServiceUrl");

async function getAuthToken() {
    return config.get("inventoryServiceToken");
}

export async function getItemStockInHub(sku:string, hubSlug:string) {
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

export async function updateStockInTheHub(sku: string, hubSlug: string, amount:number, reason = "INVENTORY_CHANGE_REASON_CORRECTION") {
    const token = await getAuthToken();
    const url = `${INVENTORY_SERVICE_URL}/v1/inventory/hub/${hubSlug}/sku/${sku}`;
    const data = {
        actor: { id: "qa" },
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
