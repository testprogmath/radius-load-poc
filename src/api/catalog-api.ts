import {getConfigPath} from "../utils";

const axios = require('axios');

const config = getConfigPath();
const CONSUMER_URL = config.get("consumerApiUrl")

export async function getProducts(locale: string, hubSlug: string) {
    const headers = {
        'locale': locale,
        'hub-slug': hubSlug
    };
    const response = await axios.get(`${CONSUMER_URL}/v1/products`, {headers});

    return response.data;
}