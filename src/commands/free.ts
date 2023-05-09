import {cancelOrder, getOrders} from "../commercetools/ct-client";


export async function free(hubSlug: string) {
    const response = await getOrders(hubSlug);
    console.log(JSON.stringify(response));
    response.body.hits.forEach(order => {
        cancelOrder(order.id);
    });

}