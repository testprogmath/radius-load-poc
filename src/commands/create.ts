import {buildCartRequest, createAndCheckoutCart, createAndCheckoutCartInStore,} from "../cart";
import {updateSpinnerText} from "../spinner";
import {OpenAPI as HubManagerConfig} from "@flink/hub-manager";
import {getConfigPath} from "../utils";
import {Colors} from "../shared/enums";
import {initializeCartApi} from "../utils/api";
import {getValidatedHubSlug} from "../utils/hub";

const chalk = require("chalk");

require('dotenv').config();


const config = getConfigPath();

export interface CreateOptions {
    locale: string;
    hubSlug: string;
    email: string;
    clickAndCollect?: boolean;
    isCLI: boolean;
    inStore?: boolean;
    productsArray?: string;
}

export async function create(options: CreateOptions) {
    let hubSlug
    try {
        hubSlug = await getValidatedHubSlug(options.hubSlug);
    } catch (error) {
        return "This hub does not exist!";
    }
    const cartApi = initializeCartApi(options.locale, hubSlug);

    HubManagerConfig.BASE = config.get("hubManagerApiUrl") as string;
    updateSpinnerText(chalk.hex(Colors.MEXICAN_PINK_DARK)("Processing... \n"), options.isCLI);

    const cartRequest = await buildCartRequest(options.email, hubSlug, options.locale, options.productsArray);
    let checkoutResult;
    if (options.inStore) {
        checkoutResult = await createAndCheckoutCartInStore(cartApi, cartRequest);
    } else {
        checkoutResult = await createAndCheckoutCart(cartApi, cartRequest, options.clickAndCollect);
    }

    return checkoutResult;

}


