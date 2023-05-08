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
const emptyCartRequest = {
    "lines": [
        {
            "variant_id": "13134734",
            "product_sku": "13134734",
            "quantity": 2
        },
        {
            "variant_id": "13134773",
            "product_sku": "13134773",
            "quantity": 3
        }
    ],
    "email": "flinkordautotest@goflink.com",
    "shipping_address": {
        "first_name": "Anissa",
        "last_name": "Little",
        "street_address_1": "",
        "city": "",
        "postal_code": "",
        "country": "",
        "phone": "+31202547999"
    },
    "delivery_coordinates": {
        "latitude": 52.3403454,
        "longitude": 4.9588151
    },
    "notes": "This is just a test",
    "delivery_eta": "8"
}

const hubSlugRegex = /\b[a-z]{2}_[a-z]+_[a-z1-9]+\b/;


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
    if (!hubSlugRegex.test(hubSlug)) {
        console.log("This hub does not exist!")
        return "This hub does not exist!";
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
