import {cancelOrder} from "../commercetools/index.js";
import {getOrderId} from "../commercetools/index.js";

export async function cancel(orderIdentifier: string) {
    const orderId = await getOrderId(orderIdentifier);
    await cancelOrder(orderId);
}