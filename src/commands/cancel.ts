import {cancelOrder, getOrderId} from "../commercetools/index.js";

export async function cancel(orderIdentifier: string) {
    const orderId = await getOrderId(orderIdentifier);
    await cancelOrder(orderId);
}