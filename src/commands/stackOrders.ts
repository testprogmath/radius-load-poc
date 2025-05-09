import axios from "axios";
import { sendStackingProposal, fetchStackState } from "../api/dispatching-api.js";
import {portForward} from "../utils/fproxy.js";
import { table } from "table";

interface Options {
    hub: string;
    orderIds: string[];
    url?: string;
}

async function sendRequests(baseUrl: string, hub: string, orderIds: string[]) {
    console.log("📦 Sending proposal...");
    const putRes = await sendStackingProposal(baseUrl, hub, orderIds);
    console.log("✅ Proposal sent:", putRes.status);

    console.log("🔍 Fetching stack state...");
    const getRes = await fetchStackState(baseUrl, hub);

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

export async function stackOrders({ hub, orderIds, url }: Options) {
    if (!Array.isArray(orderIds) || orderIds.length < 2) {
        console.error("❌ You must provide at least two order IDs to stack them.");
        process.exit(1);
    }
    let forward: { stop: () => void, port: number } | undefined;    try {
        let baseUrl: string;
        if (url) {
            baseUrl = url;
        } else {
            console.log("⏳ Starting fproxy to reach internal service...");
            forward = await portForward();
            baseUrl = `http://dispatching-hub-state-updater-staging.consumer-backend:${forward.port}`;
        }
        await sendRequests(baseUrl, hub, orderIds);

    } catch (e: any) {
        if (axios.isAxiosError(e)) {
            console.error("❌ Failed to stack orders:");
            console.error("🔁 URL:", e.config?.url);
            console.error("📟 Status:", e.response?.status);
            console.error("📬 Response body:", JSON.stringify(e.response?.data, null, 2));
        } else {
            console.error("❌ Unknown error:", e);
        }
    } finally {
        if (forward) {
            console.log("🧹 Cleaning up fproxy tunnel...");
            forward.stop();
        }
    }
}