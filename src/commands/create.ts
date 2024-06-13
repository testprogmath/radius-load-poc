import {buildCartRequest, createAndCheckoutCart, createAndCheckoutCartInStore,} from "../cart";
import {updateSpinnerText} from "../spinner";
import {OpenAPI as HubManagerConfig} from "@flink/hub-manager";
import {getConfigPath} from "../utils";
import {Colors} from "../shared/enums";
import {initializeCartApi} from "../utils/api";
import {getValidatedHubSlug} from "../utils/hub";
import {getProductsForTheHub} from "../api/catalog-api";
import {updateStockInTheHub} from "../api/inventory-service-api";
import {DEFAULT_PRODUCTS_NUMBER, DEFAULT_QUANTITY_OF_PRODUCTS} from "../utils/constants";
import {parseProductsArray} from "../utils/cli-arguments";

const chalk = require("chalk");
const emojic = require("emojic");

require('dotenv').config();


const config = getConfigPath();

// a variable for the future option of adding a different number of products

export interface CreateOptions {
    locale: string;
    hubSlug: string;
    email: string;
    clickAndCollect?: boolean;
    isCLI: boolean;
    inStore?: boolean;
    deliveryTag?: string,
    productsArray?: string;
}

export async function create(options: CreateOptions) {
    let hubSlug;
    let productsArray;
    let products;
    try {
        hubSlug = await getValidatedHubSlug(options.hubSlug);
    } catch (error) {
        return "This hub does not exist!";
    }
    const cartApi = initializeCartApi(options.locale, hubSlug);

    HubManagerConfig.BASE = config.get("hubManagerApiUrl") as string;
    updateSpinnerText(chalk.hex(Colors.MEXICAN_PINK_DARK)("Processing... \n"), options.isCLI);


    if (!options.productsArray) {
        console.log(`${emojic.banana} Looking for the products available in the hub...\n`);
      productsArray = await getProductsForTheHub(options.locale, hubSlug, DEFAULT_PRODUCTS_NUMBER);
      productsArray.forEach(item => updateStockInTheHub(item.sku, options.hubSlug, DEFAULT_QUANTITY_OF_PRODUCTS));
        products = productsArray.reduce((record, item) => {
            // @ts-ignore
            record[item.sku] = DEFAULT_QUANTITY_OF_PRODUCTS;
            return record;
        }, {});

    }
    else {
        products = parseProductsArray(options.productsArray);
        for (const [sku, number] of Object.entries(products)) {
            await updateStockInTheHub(sku, options.hubSlug, number)
        }
    }
    const cartRequest = await buildCartRequest(options.email, hubSlug, options.locale, products, options.deliveryTag);
    let checkoutResult;
    if (options.inStore) {
        checkoutResult = await createAndCheckoutCartInStore(cartApi, cartRequest);
    } else {
        checkoutResult = await createAndCheckoutCart(cartApi, cartRequest, options.clickAndCollect);
    }

    return checkoutResult;

}


