import {getOrderId, getOrderInfoById, getReturnsFromTheOrder} from "../commercetools/ct-client";

export async function getOrderReturns(orderIdentifier: string) {
    let orderId = await getOrderId(orderIdentifier);
    let orderInfo = await getOrderInfoById(orderId);
    return getReturnsFromTheOrder(orderInfo);

}