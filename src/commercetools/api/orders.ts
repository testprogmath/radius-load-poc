import {ClientResponse, Order, OrderUpdateAction} from "@commercetools/platform-sdk";
import {wait} from "../../utils.js";
import {api, ensureClientAndApi} from "./client.js";
import {isUuid} from "../../utils/types.js";
import {updateOrderState, transitionOrderState} from "../utils/orderStateUtils.js";
import chalk from "chalk";

const MAX_RETRIES = 3;
const CANCELLED_ORDER_STATE_ID = "58e94703-3324-45d2-bd7c-fa311f004f49";

export async function getOrderInfoById(orderId: string) {
    await ensureClientAndApi();
    return await api!.orders().withId({ID: orderId}).get().execute();
}

export async function getOrders(hubSlug: string) {
    await ensureClientAndApi();

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const dateString = currentDate.toISOString();

    return await api!.orders().search().post({
        body: {
            query: {
                and: [
                    {
                        or: [
                            {
                                prefix: {
                                    field: "store.key",
                                    value: hubSlug,
                                    caseInsensitive: true,
                                },
                            },
                            {
                                prefix: {
                                    field: "store.name",
                                    value: hubSlug,
                                    caseInsensitive: true,
                                    language: "en-US",
                                },
                            },
                        ],
                    },
                    {
                        not: [
                            {
                                exact: {
                                    field: "orderState",
                                    value: "Cancelled",
                                },
                            },
                        ],
                    },
                    {
                        range: {
                            field: "createdAt",
                            gte: dateString,
                        },
                    },
                ],
            },
        },
    }).execute();
}

export async function updateOrder(orderId: string, orderVersion: number, body: OrderUpdateAction) {
    await ensureClientAndApi();
    return await api!.orders().withId({ID: orderId})
        .post({
            body: {
                version: orderVersion,
                actions: [body],
            },
        })
        .execute();
}

export async function completeOrder(orderId: string) {
    await ensureClientAndApi();

    let orderInfo = await getOrderInfoById(orderId);
    await updateOrder(orderId, orderInfo.body.version, {
        action: "changeOrderState",
        orderState: "Complete",
    });

    orderInfo = await getOrderInfoById(orderId);
    await updateOrder(orderId, orderInfo.body.version, {
        action: "transitionState",
        state: {
            id: "0fa77453-da4d-4ace-a973-71082415d723",
            typeId: "state",
        },
    });

    orderInfo = await getOrderInfoById(orderId);
    await updateOrder(orderId, orderInfo.body.version, {
        action: "changeShipmentState",
        shipmentState: "Delivered",
    });

    console.log(`The order ${orderId} is completed!`);
}

export async function cancelOrder(orderId: string) {
    await ensureClientAndApi();

    let retries = 0;

    while (retries < MAX_RETRIES) {
        try {
            let orderInfo = await getOrderInfoById(orderId);
            console.debug(`The version of the order ${orderInfo.body.id} is: ${orderInfo.body.version}`);

            await updateOrderState(orderId, orderInfo.body.version);
            await wait(200);

            orderInfo = await getOrderInfoById(orderId);

            if (orderInfo.body.state?.id !== CANCELLED_ORDER_STATE_ID) {
                await transitionOrderState(orderId, orderInfo.body.version);
            }

            console.log(`The order ${orderId} is cancelled!`);
            return;
        } catch (error) {
            retries++;

            if (!(error instanceof Error)) {
                console.error("Caught an exception of an unknown type:", error);
                break;
            }

            if (!error.message.includes("ConcurrentModification")) {
                console.error("An unexpected error occurred:", error);
                break;
            }

            console.debug(`Handling ConcurrentModification error on attempt ${retries}...`);

            try {
                const actualVersion = await handleConcurrentModification(error);
                await updateOrderState(orderId, actualVersion);
                await wait(200);
            } catch (versionError) {
                console.error('Failed to handle concurrent modification:', versionError);
                break;
            }
        }
    }

    console.error(`Failed to cancel the order ${orderId} after ${MAX_RETRIES} attempts.`);
}

export async function getOrderId(orderIdentifier: string) {
    await ensureClientAndApi();
    if (!isUuid(orderIdentifier)) {
        const orderInfo = await api!.orders().withOrderNumber({orderNumber: orderIdentifier}).get().execute();
        return orderInfo.body.id;
    } else return orderIdentifier;
}

export async function deliverOrder(orderIdentifier: string): Promise<string> {
    const orderId = await getOrderId(orderIdentifier);
    let orderInfo = await getOrderInfoById(orderId);
    console.log(`Initial order version: ${orderInfo.body.version}`);

    if (orderInfo.body.orderState === "Complete") {
        console.log("The order is complete! Exiting the command...");
        return "The order is complete! Exiting the command...";
    }

    try {
        await updateOrder(orderId, orderInfo.body.version, {
            action: 'changeOrderState',
            orderState: "Complete"
        });
        await wait(200);

        await updateOrder(orderId, orderInfo.body.version + 1, {
            action: "transitionState",
            state: {
                typeId: "state",
                key: "order-delivered"
            }
        });
    } catch (error) {
        console.log('An error occurred during the delivery process:', error);
    }

    await wait(200);
    orderInfo = await getOrderInfoById(orderId);
    console.log(`Final order version: ${orderInfo.body.version}`);
    console.log(`Order state: ${orderInfo.body.orderState}`);
    return `The order ${orderId} is delivered!`;
}

export function getReturnsFromTheOrder(orderInfo: ClientResponse<Order>) {
    if (orderInfo.body.returnInfo && orderInfo.body.returnInfo.length > 0) {
        orderInfo.body.returnInfo.forEach((returnInfoItem) => {
            if (returnInfoItem.items && returnInfoItem.items.length > 0) {
                returnInfoItem.items.forEach((item, index) => {
                    console.log(chalk.hex("#FF00FF")(`Item ${index + 1}:`));
                    Object.entries(item).forEach(([key, value]) => {
                        console.log(chalk.hex("#FFC0CB")(key.padEnd(15)) + chalk.hex("#FFFFFF")(value || 'N/A'));
                    });
                });
            }
        });
        return orderInfo.body.returnInfo;
    }
    console.log("No return info or items found in the order.");
    return null;
}

async function handleConcurrentModification(error: any): Promise<number> {
    const versionRegExp = /Actual: (\d+)/;
    const actualVersionMatch = versionRegExp.exec(error.message);
    const actualVersion = parseInt(actualVersionMatch?.[1] ?? '0');

    if (actualVersion) {
        console.log(`Concurrent modification detected. Updating version to ${actualVersion} and retrying...`);
        return actualVersion;
    }
    console.log('Could not extract the actual version from the error message');
    throw new Error('Version extraction failed');
}