import { readAppConfig} from "../utils.js";
import {CartApi} from "../api/cart-api.js";


export async function initializeCartApi(locale: string, hubSlug: string) {
    const config = await readAppConfig();
    const consumerApiUrl = config.consumerApiUrl;

    return new CartApi({
        baseURL: consumerApiUrl,
        headers: {
            locale,
            "hub-slug": hubSlug,
            "Content-Type": "application/json",
        },
    });
}