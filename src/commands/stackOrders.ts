import axios from "axios";
import { sendStackingProposal, fetchStackState } from "../api/dispatching-api.js";
import { table } from "table";

import { getOrderId } from "../commercetools/index.js";
import {readAppConfig} from "../utils.js";
import {AppConfig} from "../config.js";

interface Options {
    hub: string;
    orderIds: string[];
    url?: string;
}

async function getAuth0Token(config: AppConfig) {
    const auth0ClientSecret = process.env.AUTH0_CURB_CLIENT_SECRET;

    if (!auth0ClientSecret) {
        throw new Error("Missing AUTH0_CURB_CLIENT_SECRET environment variable");
    }

    const tokenResponse = await axios.post(`https://${config.auth0Domain}/oauth/token`, {
        grant_type: "client_credentials",
        client_id: config.auth0ClientId,
        client_secret: auth0ClientSecret,
        audience: config.auth0DispatchingAudience,
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return tokenResponse.data.access_token;
}

async function sendRequests(baseUrl: string, hub: string, orderIds: string[], token: string) {
    console.log("📦 Sending proposal...");
    const putRes = await sendStackingProposal(baseUrl, hub, orderIds, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    console.log("✅ Proposal sent:", putRes.status);

    console.log("🔍 Fetching stack state...");
    const getRes = await fetchStackState(baseUrl, hub, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = getRes.data;

    console.log(`🧱 Stack ID: ${data.ID}`);
    console.log(`📍 Hub: ${data.Hub}`);
    console.log(`📅 Revision: ${data.Revision}`);

    const outputRows = [
        ["Order ID", "PDT", "ETA", "Type"]
    ];

    for (const trip of data.TripProposals || []) {
        const first = trip.FirstDelivery;
        outputRows.push([first.ID, `${first.PDT}`, `${first.ETAAtCheckout}`, "Main"]);
        if (trip.IndirectDeliveries?.length) {
            for (const indirect of trip.IndirectDeliveries) {
                outputRows.push([indirect.ID, `${indirect.PDT}`, `${indirect.ETAAtCheckout}`, "↳ Indirect"]);
            }
        }
    }

    console.log(table(outputRows));
}

export async function stackOrders({ hub, orderIds }: Options) {
    if (!Array.isArray(orderIds) || orderIds.length < 2) {
        console.error("❌ You must provide at least two order IDs to stack them.");
        process.exit(1);
    }
    try {
        const config = await readAppConfig();
        const baseUrl =config.dispatchingApiUrl;
        const token = await getAuth0Token(config);

        const resolvedOrderIds: string[] = [];

        for (const rawId of orderIds) {
            try {
                const resolved = await getOrderId(rawId);
                resolvedOrderIds.push(resolved);
            } catch (e) {
                console.error(`❌ Failed to resolve order identifier "${rawId}":`, e);
                process.exit(1);
            }
        }
        await sendRequests(baseUrl, hub, resolvedOrderIds, token);

    } catch (e: any) {
        if (axios.isAxiosError(e)) {
            console.error("❌ Failed to stack orders:");
            console.error("🔁 URL:", e.config?.url);
            console.error("📟 Status:", e.response?.status);
            console.error("📬 Response body:", JSON.stringify(e.response?.data, null, 2));
        } else {
            console.error("❌ Unknown error:", e);
        }
    }
}