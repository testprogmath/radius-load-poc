import {getOrderInfoById, getReturnsFromTheOrder, getOrderId} from "../commercetools/index.js";

export async function getOrderReturns(orderIdentifier: string) {
    let orderId = await getOrderId(orderIdentifier);
    let orderInfo = await getOrderInfoById(orderId);
    return getReturnsFromTheOrder(orderInfo);

}