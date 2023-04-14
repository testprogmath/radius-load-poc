import {CartApi} from "../api/cart-api";
import {addProductLines, addShippingMethod, checkoutCart, createCart, getCart, setDeliveryAddress} from "../cart";
import {spinnerSuccess, updateSpinnerText} from "../spinner";
import {OpenAPI as ProductsServiceConfig} from "@flink/catalog";
import {OpenAPI as HubManagerConfig} from "@flink/hub-manager";

const config = require('config');
const emptyCartRequest = require('../../resources/fixtures/new_create_cart_request.json');

// a variable for the future option of adding a different number of products
const DEFAULT_NUMBER_OF_PRODUCTS = 2;

const consumerApiUrl = config.get("consumerApiUrl") as string;
const hubManagerApiUrl = config.get("hubManagerApiUrl") as string;


HubManagerConfig.BASE = hubManagerApiUrl;
ProductsServiceConfig.BASE = consumerApiUrl;

let cartId: string;
let totalPrice: number;
export default async function create(locale: string, hubSlug: string) {
    updateSpinnerText("Processing... \n");
    const cartApi = await new CartApi({
        baseURL: consumerApiUrl,
        headers: {
            'locale': locale,
            'hub-slug': hubSlug,
            'Content-Type': 'application/json'
        },
    });

    await setDeliveryAddress(emptyCartRequest, hubSlug)
    let cartRequest = await addProductLines(emptyCartRequest, hubSlug, locale, DEFAULT_NUMBER_OF_PRODUCTS);

    console.log("The cart content is:");
    console.log(cartRequest)

    // @ts-ignore
    cartId = (await createCart(cartApi, cartRequest)).id as string;
    await addShippingMethod(cartApi, cartId);
    // @ts-ignore
    totalPrice = (await getCart(cartApi, cartId)).totalPrice?.centAmount as number;
    spinnerSuccess();
    await checkoutCart(cartApi, cartId, totalPrice);
}


