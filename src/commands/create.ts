import {
    buildCartRequest,
    createAndCheckoutCart,
    createAndCheckoutCartInStore,
    prepareProductsForCreateRequest
} from "../cart.js";
import {spinnerError, spinnerSuccess, startSpinner, updateSpinnerText} from "../spinner.js";
import {OpenAPI as HubManagerConfig} from "@flink/hub-manager";
import {initializeCartApi} from "../utils/api.js";
import {getValidatedHubSlug} from "../utils/hub.js";
import * as dotenv from "dotenv";
import {resolveLocale} from "../utils/locale.js";
import {readAppConfig} from "../utils.js";

dotenv.config({ override: true });

export interface CreateOptions {
    locale?: string;
    country?: string;
    hubSlug: string;
    email: string;
    clickAndCollect?: boolean;
    isCLI: boolean;
    inStore?: boolean;
    deliveryTag?: string;
    productsArray?: string;
}

export async function create(options: CreateOptions) {
    if (options.locale && options.country) {
        throw new Error("You cannot specify both --locale and --country.");
    }

    try {
        const locale = resolveLocale(options.locale, options.country);

        const hubSlug = await getValidatedHubSlug(options.hubSlug);
        const cartApi = await initializeCartApi(locale, hubSlug);

        const config = await readAppConfig();
        HubManagerConfig.BASE = config.hubManagerApiUrl;

        if (options.isCLI) {
            startSpinner("Creating cart and placing order...");
        }

        updateSpinnerText("Processing....", options.isCLI);

        const products = await prepareProductsForCreateRequest(hubSlug, options.productsArray);

        const cartRequest = await buildCartRequest(
            options.email,
            hubSlug,
            locale,
            products,
            options.deliveryTag
        );
        console.log(products);
        if (options.deliveryTag) console.log(`Delivery tag: ${options.deliveryTag}`);

        const result = options.inStore
            ? await createAndCheckoutCartInStore(cartApi, cartRequest)
            : await createAndCheckoutCart(cartApi, cartRequest, options.clickAndCollect);

        if (options.isCLI) {
            spinnerSuccess("Order successfully created!");
        }

        return result;

    } catch (error) {
        console.error("Error creating order:", error);
        spinnerError("Failed to create the order.");
        if (error instanceof Error && error.message.includes("Invalid hub slug")) {
            return "This hub does not exist!";
        }
        return "An error occurred while processing the order.";
    }
}
