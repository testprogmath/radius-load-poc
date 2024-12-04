import {getConfigPath} from "../utils.js";
import {CartApi} from "../api/cart-api.js";


export async function initializeCartApi(locale: string, hubSlug: string) {
    const config = await getConfigPath();
    const consumerApiUrl = config.consumerApiUrl as string;

    return new CartApi({
        baseURL: consumerApiUrl,
        headers: {
            locale,
            "hub-slug": hubSlug,
            "Content-Type": "application/json",
        },
    });
}