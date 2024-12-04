import {
    buildCartRequest,
    createAndCheckoutCart,
    createAndCheckoutCartInStore,
    prepareProductsForCreateRequest
} from "../cart.js";
import {updateSpinnerText} from "../spinner.js";
import {OpenAPI as HubManagerConfig} from "@flink/hub-manager";
import {getConfigPath} from "../utils.js";
import {Colors} from "../shared/enums.js";
import {initializeCartApi} from "../utils/api.js";
import {getValidatedHubSlug} from "../utils/hub.js";
import chalk from "chalk";
import * as dotenv from "dotenv";

dotenv.config();

export interface CreateOptions {
    locale: string;
    hubSlug: string;
    email: string;
    clickAndCollect?: boolean;
    isCLI: boolean;
    inStore?: boolean;
    deliveryTag?: string;
    productsArray?: string;
}

export async function create(options: CreateOptions) {
    try {
        const hubSlug = await getValidatedHubSlug(options.hubSlug);
        const cartApi = await initializeCartApi(options.locale, hubSlug);

        const config = await getConfigPath();
        HubManagerConfig.BASE = config.hubManagerApiUrl as string;

        updateSpinnerText(chalk.hex(Colors.MEXICAN_PINK_DARK)("Processing... \n"), options.isCLI);

        const products = await prepareProductsForCreateRequest(hubSlug, options.productsArray);

        const cartRequest = await buildCartRequest(
            options.email,
            hubSlug,
            options.locale,
            products,
            options.deliveryTag
        );
        console.debug(`Cart request: ${JSON.stringify(cartRequest)}`);

        return options.inStore
            ? await createAndCheckoutCartInStore(cartApi, cartRequest)
            : await createAndCheckoutCart(cartApi, cartRequest, options.clickAndCollect);

    } catch (error) {
        console.error("Error creating order:", error);
        if (error instanceof Error && error.message.includes("Invalid hub slug")) {
            return "This hub does not exist!";
        }
        return "An error occurred while processing the order.";
    }
}