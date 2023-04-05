import {Api} from "../Api";
import {addShippingMethod, checkoutCart, createCart, getCart} from "../cart";
require('axios');
const config = require('config');
const deCartRequest = require('../../resources/fixtures/de_ham_wint_create_cart_request.json');
const nlCartRequest = require('../../resources/fixtures/nl_ams_diem_create_cart_request.json');


const baseURL = config.get("consumerApiUrl") as string;
let cartId: string;
let totalPrice: number;
export default async function create(locale: string, hubSlug: string) {
    const api = await new Api({
        baseURL: baseURL,
        headers: {
            'locale': locale,
            'hub-slug': hubSlug,
            'Content-Type': 'application/json'
        },
    });

    cartId = (await createCart(api, nlCartRequest)).id as string;
    await addShippingMethod(api, cartId);
    totalPrice = (await getCart(api, cartId)).totalPrice?.centAmount as number;
    await checkoutCart(api, cartId, totalPrice);
}


