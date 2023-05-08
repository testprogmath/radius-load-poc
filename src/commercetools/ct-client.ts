import {createApiBuilderFromCtpClient, OrderUpdateAction} from "@commercetools/platform-sdk";
import {createClient} from "@commercetools/sdk-client-v2";
// @ts-ignore
import {createAuthMiddlewareForClientCredentialsFlow} from "@commercetools/sdk-middleware-auth";
// @ts-ignore
import {createHttpMiddleware} from "@commercetools/sdk-middleware-http";
import dotenv from "dotenv";
import {getConfigPath} from "../utils";

const fetch = require('node-fetch');

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


export async function getOrders(hubSlug: string) {
    // get current date
    const currentDate = new Date();

// set time to midnight
    currentDate.setHours(0, 0, 0, 0);

// format date object into string in ISO format
    const dateString = currentDate.toISOString();

    return await api.orders().search().post({
        body: {
            query: {
                "and": [
                    {
                        "or": [{
                            "prefix": {
                                "field": "store.key",
                                "value": hubSlug,
                                "caseInsensitive": true
                            }
                        },
                            {
                                "prefix": {
                                    "field": "store.name",
                                    "value": hubSlug,
                                    "caseInsensitive": true,
                                    "language": "en-US"
                                }
                            }]
                    },
                    {
                        "not": [
                            {
                                "exact": {
                                    "field": "orderState",
                                    "value": "Complete"
                                }
                            },
                            {
                                "exact": {
                                    "field": "orderState",
                                    "value": "Cancelled"
                                }
                            }
                        ]
                    },
                    {
                        "range": {
                            "field": "createdAt",
                            "gte": dateString
                        }
                    }
                ]
            }
        }
    }).execute();
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

export async function completeOrder(orderId: string) {

    //get last version
    let orderInfo = await getOrderInfoById(orderId);
    //complete the order
    await updateOrder(orderId, orderInfo.body.version, {
        action: 'changeOrderState',
        orderState: "Complete"
    });

    orderInfo = await getOrderInfoById(orderId);
    await updateOrder(orderId, orderInfo.body.version, {
        action: 'transitionState',
        state: {
            id: "0fa77453-da4d-4ace-a973-71082415d723",
            typeId: "state"
        }
    })

    orderInfo = await getOrderInfoById(orderId);
    await updateOrder(orderId, orderInfo.body.version, {
        action: "changeShipmentState",
        shipmentState: "Delivered"
    });
    console.log(`The order ${orderId} is completed!`)

}

export async function cancelOrder(orderId: string) {
    const CANCELLED_ORDER_STATE_ID = "58e94703-3324-45d2-bd7c-fa311f004f49";
    let orderInfo = await getOrderInfoById(orderId);
    console.log(`The version of the order ${orderInfo.body.id} is: ${orderInfo.body.version}`);
    //complete the order
    await updateOrder(orderId, orderInfo.body.version, {
        action: 'changeOrderState',
        orderState: "Cancelled"
    });
    //get last version
    orderInfo = await getOrderInfoById(orderId);
    console.log(orderInfo.body.orderState);
    console.log(orderInfo.body.state);
    console.log(`The version of the order ${orderInfo.body.id} is: ${orderInfo.body.version}`);
    if (orderInfo.body.state?.id !== CANCELLED_ORDER_STATE_ID)
        await updateOrder(orderId, orderInfo.body.version, {
            action: 'transitionState',
            state: {
                id: CANCELLED_ORDER_STATE_ID,
                typeId: "state"
            }
        });

    console.log(`The order ${orderId} is cancelled!`)

}

