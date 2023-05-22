import {getConfigPath} from "../utils";
import {CartApi} from "../api/cart-api";

const config = getConfigPath();
export function initializeCartApi(locale: string, hubSlug: string) {
    const consumerApiUrl = config.get("consumerApiUrl") as string;

    return new CartApi({
        baseURL: consumerApiUrl,
        headers: {
            locale,
            "hub-slug": hubSlug,
            "Content-Type": "application/json",
        },
    });
}