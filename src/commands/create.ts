import {CartApi} from "../api/cart-api";
import {
    addProductLines,
    addShippingMethod,
    checkoutCart,
    createCart,
    getCart,
    setDeliveryAddress,
    setEmail
} from "../cart";
import {spinnerSuccess, updateSpinnerText} from "../spinner";
import {OpenAPI as HubManagerConfig} from "@flink/hub-manager";
import {Colors} from "../shared/enums";
import {getConfigPath} from "../utils";

const chalk = require("chalk");
const emojic = require("emojic");

const inquirer = require("inquirer");



const config = getConfigPath();

const emptyCartRequest = require('../../resources/fixtures/new_create_cart_request.json');

// a variable for the future option of adding a different number of products
const DEFAULT_NUMBER_OF_PRODUCTS = 2;



let cartId: string;
let totalPrice: number;
export default async function create(locale: string, hubSlug: string, email: string) {
    const consumerApiUrl = config.get("consumerApiUrl") as string;
    const hubManagerApiUrl = config.get("hubManagerApiUrl") as string;


    HubManagerConfig.BASE = hubManagerApiUrl;
    if (!hubSlug) {
        const response = await inquirer.prompt([
            {type: 'input', name: 'hub', message: "Enter the desired hub", default: "fr_par_lepe"}
        ]);
        hubSlug = response.hub;
    }

    const cartApi = await new CartApi({
        baseURL: consumerApiUrl,
        headers: {
            'locale': locale,
            'hub-slug': hubSlug,
            'Content-Type': 'application/json'
        },
    });

    updateSpinnerText(chalk.hex(Colors.MEXICAN_PINK_DARK)("Processing... \n"));

    setEmail(emptyCartRequest, email);
    await setDeliveryAddress(emptyCartRequest, hubSlug)
    let cartRequest = await addProductLines(emptyCartRequest, hubSlug, locale, DEFAULT_NUMBER_OF_PRODUCTS);

    console.log(`${emojic.shoppingCart} The cart content is:`);
    console.log(cartRequest)

    // @ts-ignore
    cartId = (await createCart(cartApi, cartRequest)).id as string;
    await addShippingMethod(cartApi, cartId);
    // @ts-ignore
    totalPrice = (await getCart(cartApi, cartId)).totalPrice?.centAmount as number;
    spinnerSuccess();
    await checkoutCart(cartApi, cartId, totalPrice);
}
