import {CartApi, CartOrder, GetCartResponseV3} from "./api/cart-api.js";
import {LegacyHubDetailsService} from "@flink/hub-manager";
import {spinnerError, spinnerSuccess, stopSpinner} from "./spinner.js";
import {getConfigPath, wait} from "./utils.js";
import chalk from "chalk";
// @ts-ignore
import emojic from "emojic";
import {Colors} from "./shared/enums.js";
import {Hubs} from "./shared/hubs.js";
import {authorizeInStore} from "./api/website-api.js";
import axios, {AxiosResponse} from "axios";
import {CartLine, CartRequest} from "./api/objects/cart-request.js";
import {printErrorAndStopSpinner} from "./utils/spinner.js";

import * as dotenv from "dotenv";
import {getInventoryChangesForTheHub, updateStockInTheHub} from "./api/inventory-service-api.js";
import {DEFAULT_QUANTITY_OF_PRODUCTS} from "./utils/constants.js";
import {parseProductsArray} from "./utils/cli-arguments.js";
import {DeliveryDetails} from "./shared/deliveryAddress.js";

dotenv.config();

let config: any;
let inStoreLogin: string;
let inStorePassword: string;
let isInitialized = false;

const cartToken = {
    amount: {
        currency: "EUR",
        value: 1000,
    },
    additionalData: {
        allow3DS2: true,
    },
    paymentMethod: {
        type: "scheme",
        encryptedCardNumber: "test_5555555555554444",
        encryptedExpiryMonth: "test_03",
        encryptedExpiryYear: "test_2030",
        encryptedSecurityCode: "test_737",
    },
    channel: "Web",
    browserInfo: {
        userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
        acceptHeader:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    },
    returnUrl: "https://webhook.site/",
};

async function ensureInitialized() {
    if (!isInitialized) {
        config = await getConfigPath();
        inStoreLogin = config.instoreLogin;
        inStorePassword = config.instorePassword;
        isInitialized = true;
    }
}

export async function createCart(customerDomainApi: CartApi<any>, cartRequest: CartRequest) {
    await ensureInitialized();
    let response: AxiosResponse<GetCartResponseV3> | undefined;
    try {
        response = await customerDomainApi.v3.createCartV3(cartRequest);
        if (response.status === 200) {
            const cartId = response.data.id as string;
            console.log(`${emojic.shoppingCart} The cart is created with the id ${chalk.hex(Colors.THULIAN_PINK)(cartId)}`);
        }
        console.log();
    } catch (e) {
        printErrorAndStopSpinner(e);
    }
    return response?.data ?? null;
}

export async function addShippingMethod(customerDomainApi: CartApi<any>, cartId: string, clickAndCollect: boolean = false) {
    await ensureInitialized();
    try {
        const response = await customerDomainApi.v2.setShippingMethodV2(cartId, {clickAndCollect: clickAndCollect});
        if (response.status === 200) {
            console.log(`${emojic.rocket} The shipping method is assigned, clickAndCollect is ${chalk.hex(Colors.MEXICAN_PINK)(clickAndCollect)}`);
        }
        console.log();
    } catch (e) {
        console.error("Error during addShippingMethod:", e);
        printErrorAndStopSpinner(e);
    }
}

export async function getCart(customerDomainApi: CartApi<any>, cartId: string) {
    await ensureInitialized();
    let response: AxiosResponse<GetCartResponseV3> | undefined;
    try {
        response = await customerDomainApi.v3.getCartV3(cartId);
        if (response && response.status === 200) {
            console.log(`The cart is created with the id ${chalk.hex(Colors.MEXICAN_PINK)(cartId)}`);
        }
        console.log();
    } catch (e) {
        printErrorAndStopSpinner(e);
    }
    return response?.data ?? null;
}

async function getToken() {
    await ensureInitialized();
    const url = config.firebaseUrl;
    const apiKey = config.firebaseApiKey;
    try {
        const response = await axios.post(
            url,
            {
                email: inStoreLogin,
                password: inStorePassword,
                returnSecureToken: true,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                params: {
                    key: apiKey,
                },
            }
        );

        return response.data.idToken as string;
    } catch (error) {
        console.error("Error during sign in:", error);
        return null;
    }
}

export async function checkoutCart(customerDomainApi: CartApi<any>, cartId: string, totalPrice: number): Promise<CartOrder | undefined | null> {
    await ensureInitialized();
    const token = await getToken();

    if (!token) {
        throw new Error("Failed to retrieve authentication token.");
    }

    const MAX_RETRIES = 3;
    cartToken.amount.value = totalPrice;
    let orderInfo;
    let response;
    try {
        let retry = 0;
        while (retry < MAX_RETRIES) {
            response = await customerDomainApi.v3.checkoutV3(
                cartId,
                {
                    amount: totalPrice,
                    token: JSON.stringify(cartToken),
                },
                token
            );
            if (response.status === 200) {
                console.log(`${emojic.confettiBall} The order is created!`);
                orderInfo = await checkIfOrderIsCreated(customerDomainApi, cartId);
                break;
            } else {
                console.log("The order was not created.");
            }
            retry++;
        }
        return orderInfo;
    } catch (e) {
        printErrorAndStopSpinner(e);
    }
}

export async function checkoutCartInStore(customerDomainApi: CartApi<any>, cartId: string, totalPrice: number) {
    await ensureInitialized();
    const tokenResponse = await authorizeInStore(inStoreLogin, inStorePassword);
    const response = await customerDomainApi.v3.checkoutInStoreRequest(
        cartId,
        {
            amount: {
                currency: "EUR",
                value: totalPrice,
            },
        },
        {
            headers: {
                Authorization: `Bearer ${tokenResponse.idToken}`,
                "Anonymous-Id": "84622d81-81d4-4506-9edd-7f596ed4878d",
                "optimizely-id": "cjHD8lsxOybg",
                "user-tracking-id": "cjHD8lsxOybg",
            },
        }
    );
    let orderInfo;
    if (response.status === 200) {
        console.log(`${emojic.confettiBall} The order is created!`);
        await checkPaymentStatus(customerDomainApi, cartId);
        orderInfo = await checkIfOrderIsCreated(customerDomainApi, cartId);
    } else {
        console.log("The order was not created.");
    }
    return orderInfo;
}


export async function checkPaymentStatus(customerDomainApi: CartApi<any>, cartId: string,) {
    await ensureInitialized();
    let response = await customerDomainApi.v3.getPaymentStatusInStore(cartId);
    const MAX_RETRIES_COUNT = 40;
    let retries = 0;
    while (response.data.status === "PENDING" && retries < MAX_RETRIES_COUNT) {
        retries = retries + 1;
        console.log(`Attempt ${retries}:Trying to get the payment done...`)
        response = await customerDomainApi.v3.getPaymentStatusInStore(cartId);
        if (response.data.status === "PENDING" && retries < MAX_RETRIES_COUNT) {
            await wait(2000);
        }
    }
    if (response.data.status === "PAID") {
        console.log(`${emojic.confettiBall} The order is paid!`);
    } else console.log(`${emojic.confettiBall} The order is not paid! Please try again.`);
}

async function checkIfOrderIsCreated(customerDomainApi: CartApi<any>, cartId: string) {

    const MAX_RETRIES = 20;
    const RETRY_DELAY = 200;
    let order;
    await ensureInitialized();
    try {
        const getCartResponse = await customerDomainApi.v3.getCartV3(cartId);
        if (getCartResponse.status === 200) {
            order = await waitForOrderAssignment(customerDomainApi, cartId, MAX_RETRIES, RETRY_DELAY);

            if (!order) {
                console.log("The cart is not assigned to the order. Please try later");
                spinnerError("Your request failed. Please find the stacktrace above");
                stopSpinner();
                return;
            }

            console.log(`${emojic.memo} The order number is ${chalk.hex(Colors.LAVENDER_PINK).bold(order?.number)} and the order id is ${chalk.hex(Colors.THULIAN_PINK).bold(order?.id)}`);
        } else {
            console.log("Something went wrong. Please check the logs and try later.");
        }
    } catch (error) {
        console.error("An error occurred while checking if the order is created:", error);
    }

    return order;
}

async function waitForOrderAssignment(customerDomainApi: CartApi<any>, cartId: string, maxRetries: number, retryDelay: number) {
    await ensureInitialized();
    let retry = 0;

    while (retry < maxRetries) {
        try {
            const getCartResponse = await customerDomainApi.v3.getCartV3(cartId);

            if (getCartResponse.data.order) {
                console.log('Order assigned:', getCartResponse.data.order);
                return getCartResponse.data.order;
            }

            retry++;
            await wait(retryDelay);
        } catch (error) {
            console.error(`Error on attempt ${retry + 1}:`, error);
        }
    }

    console.log('Order assignment not found after max retries.');
    return null;
}


export async function addProductLines(cartRequest: CartRequest, hubSlug: string, locale: string, products: Record<string, number>) {
    await ensureInitialized();
    console.log(`${emojic.grapes} Setting products available in the hub...\n`);
    try {
        if (Array.isArray(products))
            addDefaultProductLines(cartRequest, products);
        else {

            addCustomProductLines(cartRequest, products);
        }

    } catch (e) {
        printErrorAndStopSpinner(e);
    }
    return cartRequest;
}

function addDefaultProductLines(cartRequest: CartRequest, products: Record<string, number>) {
    for (const [sku, number] of Object.entries(products)) {
        const lineItem = new CartLine(sku, sku, number as number);
        cartRequest.lines.push(lineItem);

    }
}

function addCustomProductLines(cartRequest: CartRequest, products: Record<string, number>) {
    for (const [sku, number] of Object.entries(products)) {
        const lineItem = new CartLine(sku, sku, number);
        cartRequest.lines.push(lineItem);
    }
}

export async function setDeliveryAddress(cartRequest: CartRequest, hubSlug: string, deliveryTag?: string): Promise<any> {
    try {
        let deliveryDetail = DeliveryDetails[hubSlug]
        if (!deliveryDetail || Object.keys(deliveryDetail).length === 0) {
            console.log("Delivery detail is empty or doesn't exist.");
            return
          } 

        cartRequest.delivery_coordinates = {
            latitude: deliveryDetail.coordinates.latitude,
            longitude: deliveryDetail.coordinates.longitude
        }

        cartRequest.shipping_address = {
            first_name: "Test",
            last_name: "Flinkord",
            street_address_1: deliveryDetail.address.street,
            phone: deliveryDetail.contact.phone,
            city: deliveryDetail.address.city,
            country: deliveryDetail.address.country,
            postal_code: deliveryDetail.address.postalCode,
            tag: deliveryTag
        }
    } catch (e) {
        printErrorAndStopSpinner(e);
    }

    return cartRequest;
}

export function setEmail(cartRequest: CartRequest, email: string) {
    console.log(`${emojic.outboxTray} Setting the email to receive notifications about your order...\n`);
    cartRequest.email = email;
    return cartRequest;
}


export async function buildCartRequest(email: string, hubSlug: string, locale: string, productsArray: {}, deliveryTag?: string) {
    let cartRequestBody = new CartRequest();
    setEmail(cartRequestBody, email);
    await setDeliveryAddress(cartRequestBody, hubSlug, deliveryTag);
    await addProductLines(cartRequestBody, hubSlug, locale, productsArray);
    return cartRequestBody;
}

export async function createCartWithAssignedData(cartApi: CartApi<any>, cartRequest: CartRequest) {
    await ensureInitialized();
    const createCartResult = await createCart(cartApi, cartRequest);
    if (!createCartResult) {
        throw new Error("A cart cannot be created.");
    }
    return createCartResult.id as string;
}

export async function getCreatedCart(cartApi: CartApi<any>, cartId: string) {
    await ensureInitialized();
    const getCartResponse = await getCart(cartApi, cartId);
    if (!getCartResponse) {
        throw new Error("A cart does not exist.");
    }
    return getCartResponse;
}

export async function createAndCheckoutCartInStore(cartApi: CartApi<any>, cartRequest: CartRequest) {
    await ensureInitialized();
    cartRequest.shipping_method_id = "8fb7876a-4d17-49fb-ac6e-8f4971ccba4c";
    cartRequest.delivery_tier_id = "core";

    console.log(`${emojic.shoppingCart} The cart content is:`);
    console.log(cartRequest);

    const cartId = await createCartWithAssignedData(cartApi, cartRequest);
    const cart = await getCreatedCart(cartApi, cartId);
    const totalPrice = cart.totalPrice?.centAmount as number;

    spinnerSuccess();

    return await checkoutCartInStore(cartApi, cartId, totalPrice);
}

export async function createAndCheckoutCart(cartApi: CartApi<any>, cartRequest: CartRequest, clickAndCollect = false) {
    await ensureInitialized();
    console.log(`${emojic.shoppingCart} The cart content is:`);
    console.log(cartRequest);

    const cartId = await createCartWithAssignedData(cartApi, cartRequest);
    await addShippingMethod(cartApi, cartId, clickAndCollect);

    const cart = await getCreatedCart(cartApi, cartId);
    const totalPrice = cart.totalPrice?.centAmount as number;

    spinnerSuccess();

    return await checkoutCart(cartApi, cartId, totalPrice);
}

export async function prepareProductsForCreateRequest(hubSlug: string, productsArray: string | undefined): Promise<{ [key: string]: number }> {
    if (!productsArray) {
        console.log(`${emojic.banana} Looking for products available in the hub...\n`);
        const inventoryItems: string[] = await getInventoryChangesForTheHub(hubSlug) as string[];
        console.log("Found in logs:", inventoryItems);

        await Promise.all(
            inventoryItems.map(item => updateStockInTheHub(item, hubSlug, DEFAULT_QUANTITY_OF_PRODUCTS))
        );

        return inventoryItems.reduce((acc, item) => {
            acc[item] = DEFAULT_QUANTITY_OF_PRODUCTS;
            return acc;
        }, {} as { [key: string]: number });
    }

    const parsedProducts = parseProductsArray(productsArray);
    await Promise.all(
        Object.entries(parsedProducts).map(([sku, qty]) => updateStockInTheHub(sku, hubSlug, qty))
    );
    return parsedProducts;
}