import {ClientResponse, createApiBuilderFromCtpClient, Order, OrderUpdateAction} from "@commercetools/platform-sdk";
import {createClient} from "@commercetools/sdk-client-v2";
// @ts-ignore
import {createAuthMiddlewareForClientCredentialsFlow} from "@commercetools/sdk-middleware-auth";
// @ts-ignore
import {createHttpMiddleware} from "@commercetools/sdk-middleware-http";
import dotenv from "dotenv";
import {getConfigPath, wait} from "../utils";
import {isUuid} from "../utils/types";
import chalk from "chalk";

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

const MAX_RETRIES = 3;  // Maximum number of times to retry

const CANCELLED_ORDER_STATE_ID = "58e94703-3324-45d2-bd7c-fa311f004f49";

async function updateOrderState(orderId: string, version: number) {
    await updateOrder(orderId, version, {
        action: 'changeOrderState',
        orderState: "Cancelled"
    });
}

async function transitionOrderState(orderId: string, version: number) {
    await updateOrder(orderId, version, {
        action: 'transitionState',
        state: {
            id: CANCELLED_ORDER_STATE_ID,
            typeId: "state"
        }
    });
}

async function handleConcurrentModification(error: any) {
    const versionRegExp = /Actual: (\d+)/;
    const actualVersionMatch = versionRegExp.exec(error.message);
    const actualVersion = parseInt(actualVersionMatch?.[1] ?? '0');

    if (actualVersion) {
        console.log(`Concurrent modification detected. Updating version to ${actualVersion} and retrying...`);
        return actualVersion;
    } else {
        console.log('Could not extract the actual version from the error message');
        throw new Error('Version extraction failed');
    }
}

export async function cancelOrder(orderId: string) {
    let retries = 0;

    while (retries < MAX_RETRIES) {
        try {
            let orderInfo = await getOrderInfoById(orderId);
            console.log(`The version of the order ${orderInfo.body.id} is: ${orderInfo.body.version}`);

            await updateOrderState(orderId, orderInfo.body.version);
            await wait(200);
            orderInfo = await getOrderInfoById(orderId);

            if (orderInfo.body.state?.id !== CANCELLED_ORDER_STATE_ID) {
                await transitionOrderState(orderId, orderInfo.body.version);
            }

            console.log(`The order ${orderId} is cancelled!`);
            break;
        } catch (error) {
            if (!(error instanceof Error)) {
                console.log('Caught an exception of an unknown type:', error);
                break;
            }
            if (!error.message.includes('ConcurrentModification')) {
                console.log('An unexpected error occurred:', error);
                break;
            }

            try {
                await handleConcurrentModification(error);
                retries++;
                await wait(200);
            } catch (versionError) {
                break;
            }
        }
    }

    if (retries >= MAX_RETRIES) {
        console.log(`Failed to cancel the order ${orderId} after ${MAX_RETRIES} attempts.`);
    }
}


export async function getOrderId(orderIdentifier: string) {
    if (!isUuid(orderIdentifier)) {
        const orderInfo = await api.orders().withOrderNumber({orderNumber: orderIdentifier}).get().execute();
        return orderInfo.body.id;
    } else return orderIdentifier;
}

export async function deliverOrder(orderIdentifier: string): Promise<string> {
    let orderId = await getOrderId(orderIdentifier);
    let orderInfo = await getOrderInfoById(orderId);
    console.log(`Initial order version: ${orderInfo.body.version}`);

    if (orderInfo.body.orderState === "Complete") {
        console.log("The order is complete! Exiting the command...");
        return "The order is complete! Exiting the command...";
    }
    console.log(`The version of the order ${orderInfo.body.id} is: ${orderInfo.body.version}`);
    try {
        // Complete the order
        await updateOrder(orderId, orderInfo.body.version, {
            action: 'changeOrderState',
            orderState: "Complete"
        });
        await wait(200);

        // Transition order state
        await updateOrder(orderId, orderInfo.body.version + 1, {
            action: "transitionState",
            state: {
                typeId: "state",
                key: "order-delivered"
            }
        });
    } catch (error) {
        if (!(error instanceof Error)) {
            console.log('Caught an exception of an unknown type:', error);
        }
        // @ts-ignore
        if (!error.message.includes('ConcurrentModification')) {
            console.log('An unexpected error occurred:', error);
        }

        try {

            await wait(200);
            await handleConcurrentModification(error);
            await updateOrder(orderId, orderInfo.body.version + 1, {
                action: "transitionState",
                state: {
                    typeId: "state",
                    key: "order-delivered"
                }
            });
        } catch (versionError) {
        }
    }
        await wait(200);

        // Get last version
        orderInfo = await getOrderInfoById(orderId);
        console.log(`Final order version: ${orderInfo.body.version}`);
        console.log(`Order state: ${orderInfo.body.orderState}`);
        console.log(`The order ${orderId} is delivered!`);
        return `The order ${orderId} is delivered!`;
    }

    export function getReturnsFromTheOrder(orderInfo: ClientResponse<Order>) {
        if (orderInfo.body.returnInfo && orderInfo.body.returnInfo.length > 0) {
            orderInfo.body.returnInfo.forEach((returnInfoItem) => {
                if (returnInfoItem.items && returnInfoItem.items.length > 0) {
                    returnInfoItem.items.forEach((item, index) => {
                        console.log(chalk.hex("#FF00FF")(`Item ${index + 1}:`));
                        Object.entries(item).forEach(([key, value]) => {
                            console.log(chalk.hex("#FFC0CB")(key.padEnd(15)) + chalk.hex("#FFFFFF")(value ? value : 'N/A'));
                        });
                        console.log('\n');
                    });
                }
            });
            return orderInfo.body.returnInfo;
        } else {
            console.log("No return info or items found in the order.");
            return null;
        }
    }

