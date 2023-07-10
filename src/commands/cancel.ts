import {cancelOrder, getOrderId} from "../commercetools/ct-client";

export async function cancel(orderIdentifier: string){
    const orderId = await getOrderId(orderIdentifier);
    await cancelOrder(orderId);
}