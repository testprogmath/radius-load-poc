import {deliverOrder} from "../commercetools/ct-client";

export async function deliver(orderId: string): Promise<string> {
       return deliverOrder(orderId);
}