import axios from "axios";
import {getConfigPath} from "../utils";

const config = getConfigPath();
axios.defaults.baseURL = config.get("hubApiUrl");
axios.defaults.headers.patch['x-api-key'] = config.get('hubApiKey');

export async function inboundItems(hubSlug: string, productSku: string, quantity: number) {
    let response;
    try {
        response = await axios.patch(`/inventory/v1/hubs/${hubSlug}/products/${productSku}/stock`, {"quantity_delta": quantity});

    } catch (e) {
        return "Cannot inbound items"
    }
    return response;

}