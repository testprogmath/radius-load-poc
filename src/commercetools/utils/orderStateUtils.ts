import {updateOrder} from "../api/orders.js";
export const CANCELLED_ORDER_STATE_ID = "58e94703-3324-45d2-bd7c-fa311f004f49";


export async function updateOrderState(orderId: string, version: number): Promise<void> {
    await updateOrder(orderId, version, {
        action: 'changeOrderState',
        orderState: "Cancelled"
    });
}


export async function transitionOrderState(orderId: string, version: number): Promise<void> {
    await updateOrder(orderId, version, {
        action: 'transitionState',
        state: {
            id: CANCELLED_ORDER_STATE_ID,
            typeId: "state"
        }
    });
}


export async function handleConcurrentModification(error: any): Promise<number> {
    const versionRegExp = /Actual: (\d+)/;
    const actualVersionMatch = versionRegExp.exec(error.message);
    const actualVersion = parseInt(actualVersionMatch?.[1] ?? '0');

    if (actualVersion) {
        console.log(`Concurrent modification detected. Updating version to ${actualVersion} and retrying...`);
        return actualVersion;
    } else {
        console.error('Could not extract the actual version from the error message');
        throw new Error('Version extraction failed');
    }
}

