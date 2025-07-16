import {cancelOrder, getOrders} from "../commercetools/index.js";

export async function free(hubSlug: string) {
    const response = await getOrders(hubSlug);
    response.body.hits.forEach(order => {
        cancelOrder(order.id);
    });
    console.log("✅ All orders are cancelled!");
}