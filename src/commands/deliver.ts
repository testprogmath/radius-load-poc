import {deliverOrder} from "../commercetools/index.js";

export async function deliver(orderId: string): Promise<string> {
    return deliverOrder(orderId);
}