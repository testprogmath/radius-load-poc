import {createApiBuilderFromCtpClient, OrderUpdateAction} from "@commercetools/platform-sdk";
import {createClient} from "@commercetools/sdk-client-v2";
// @ts-ignore
import {createAuthMiddlewareForClientCredentialsFlow} from "@commercetools/sdk-middleware-auth";
// @ts-ignore
import {createHttpMiddleware} from "@commercetools/sdk-middleware-http";

const fetch = require('node-fetch');
import dotenv from "dotenv";
import {getConfigPath} from "../utils";

dotenv.config();
const config = getConfigPath();
const CT_AUTH_URL = config.get("CTAuthUrl");
const CT_API_URL = config.get("CTApiUrl");
const projectKey = process.env.CT_PROJECT_KEY as string;

const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
    host: CT_AUTH_URL,
    projectKey,
    credentials: {
        clientId: process.env.CT_CLIENT_ID,
        clientSecret: process.env.CT_CLIENT_SECRET,
    },
    scopes: [`manage_orders:${projectKey}`, `view_states:${projectKey}`],
    fetch,
});

const httpMiddleware = createHttpMiddleware({
    host: CT_API_URL,
    fetch,
});

const ctpClient = createClient({
    middlewares: [authMiddleware, httpMiddleware],
});

export const api = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
    projectKey,
});

export async function getOrderInfoById(orderId: string) {
    return await api.orders().withId({ID: orderId}).get().execute();
}

export async function updateOrder(orderId: string, orderVersion: number, body: OrderUpdateAction) {
    return await api.orders().withId({ID: orderId})
        .post({
            body: {
                version: orderVersion,
                actions: [
                    body
                ]
            }
        })
        .execute();
}

