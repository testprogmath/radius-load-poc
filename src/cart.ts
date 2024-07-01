import {CartApi, CartOrder, GetCartResponseV3} from "./api/cart-api";
import {LegacyHubDetailsService} from "@flink/hub-manager";
import {spinnerError, spinnerSuccess, stopSpinner} from "./spinner";
import {getConfigPath, wait} from "./utils";
import chalk from "chalk";
import {Colors} from "./shared/enums";
import {Hubs} from "./shared/hubs";
import {authorizeInStore} from "./api/website-api";
import axios, {AxiosResponse} from "axios";
import {CartLine, CartRequest} from "./api/objects/cart-request";
import {printErrorAndStopSpinner} from "./utils/spinner";

require('dotenv').config();

const config = getConfigPath();
const inStoreLogin = config.get('instoreLogin');
const inStorePassword = config.get('instorePassword');
const cartToken = {
    "amount": {
        "currency": "EUR",
        "value": 1000
    },
    "additionalData": {
        "allow3DS2": true
    },
    "paymentMethod": {
        "type": "scheme",
        "encryptedCardNumber": "test_5555555555554444",
        "encryptedExpiryMonth": "test_03",
        "encryptedExpiryYear": "test_2030",
        "encryptedSecurityCode": "test_737"
    },
    "channel": "Web",
    "browserInfo": {
        "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
        "acceptHeader": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
    },
    "returnUrl": "https://webhook.site/"
}


const emojic = require("emojic");

export async function createCart(customerDomainApi: CartApi<any>, cartRequest: CartRequest) {
    let response: AxiosResponse<GetCartResponseV3> | undefined;
    try {
        response = await customerDomainApi.v3.createCartV3(cartRequest);
        if (response.status === 200) {
            const cartId = response.data.id as string;
            console.log(`${emojic.shoppingCart} The cart is created with the id ${chalk.hex(Colors.THULIAN_PINK)(cartId)}`);
        }
        console.log();
    } catch
        (e) {
        printErrorAndStopSpinner(e);
    }
    return response?.data ?? null;
}

export async function addShippingMethod(customerDomainApi: CartApi<any>, cartId: string, clickAndCollect: boolean = false) {
    try {
        const response = await customerDomainApi.v2.setShippingMethodV2(cartId, {clickAndCollect: clickAndCollect});
        if (response.status === 200) {
            console.log(`${emojic.rocket} The shipping method is assigned, clickAndCollect is ${chalk.hex(Colors.MEXICAN_PINK)(clickAndCollect)}`);
        }
        console.log();
    } catch
        (e) {
        printErrorAndStopSpinner(e);
    }
}

export async function getCart(customerDomainApi: CartApi<any>, cartId: string) {
    let response: AxiosResponse<GetCartResponseV3> | undefined;
    try {
        response = await customerDomainApi.v3.getCartV3(cartId);
        if (response && response.status === 200) {
            console.log(`The cart is created with the id ${chalk.hex(Colors.MEXICAN_PINK)(cartId)}`);
        }
        console.log();
    } catch
        (e) {
        printErrorAndStopSpinner(e);
    }
    return response?.data ?? null;
}

async function getToken() {
    const url = config.get("firebaseUrl");
    const apiKey = config.get("firebaseApiKey");
    try {
        const response = await axios.post(url, {
            email: "lucas+kiosk@goflink.com",
            password: "123456",
            returnSecureToken: true
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                key: apiKey
            }
        });

        return response.data.idToken as string;
    } catch (error) {
        console.error('Error during sign in:', error);
        return null;
    }
}
export async function checkoutCart(customerDomainApi: CartApi<any>, cartId: string, totalPrice: number): Promise<CartOrder | undefined | null> {

    let token = await getToken() as string;
    const MAX_RETRIES = 3;
    cartToken.amount.value = totalPrice;
    let orderInfo;
    let response;
    try {
        let retry = 0;
        while (retry < MAX_RETRIES) {
            response = await customerDomainApi.v3.checkoutV3(cartId, {
                    "amount": totalPrice,
                    "token": JSON.stringify(cartToken)
                },  token
            );
            if (response.status === 200) {
                console.log(`${emojic.confettiBall} The order is created!`);
                orderInfo = await checkIfOrderIsCreated(customerDomainApi, cartId);
                break;
            } else {
                console.log("The order was not created.")
            }
            retry++;
        }
        return orderInfo;
    } catch
        (e) {
        printErrorAndStopSpinner(e);
    }
}

export async function checkoutCartInStore(customerDomainApi: CartApi<any>, cartId: string, totalPrice: number) {
    const tokenResponse = await authorizeInStore(inStoreLogin, inStorePassword);
    const response = await customerDomainApi.v3.checkoutInStoreRequest(cartId, {
            "amount": {
                currency: "EUR",
                value: totalPrice
            }
        },
        {
            headers: {'Authorization': `Bearer ${tokenResponse.idToken}`}
        }
    );
    let orderInfo;
    if (response.status === 200) {
        console.log(`${emojic.confettiBall} The order is created!`);
        await checkPaymentStatus(customerDomainApi, cartId);
        orderInfo = await checkIfOrderIsCreated(customerDomainApi, cartId);

    } else {
        console.log("The order was not created.")
    }
    return orderInfo;
}


export async function checkPaymentStatus(customerDomainApi: CartApi<any>, cartId: string,) {
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
    let retry = 0;

    while (retry < maxRetries) {
        const getCartResponse = await customerDomainApi.v3.getCartV3(cartId);

        if (getCartResponse.data.order) {
            return getCartResponse.data.order;
        }

        retry++;
        await wait(retryDelay);
    }

    return null;
}


export async function addProductLines(cartRequest: CartRequest, hubSlug: string, locale: string, products: Record<string, number>) {
    console.log(`${emojic.grapes} Setting products available in the hub...\n`);
    try {
        if (Array.isArray(products))
                addDefaultProductLines(cartRequest, products);
        else {

            addCustomProductLines(cartRequest, products);
        }

        console.log(cartRequest);
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
        const hubInfo = await LegacyHubDetailsService.getHubDetailsWithSlugRequest({hubSlug: hubSlug});

        let hubCoordinates = Hubs[hubSlug];

        if (!hubCoordinates) {
            // @ts-ignore
            hubCoordinates = hubInfo.turfs[0][2];
        }

        if (!hubCoordinates?.latitude || !hubCoordinates?.longitude) {
            return 'Unable to find hub coordinates';
        }

        cartRequest.delivery_coordinates = {
            latitude: hubCoordinates.latitude,
            longitude: hubCoordinates.longitude
        }

        cartRequest.shipping_address = {
            first_name: "Test",
            last_name: "Flinkord",
            street_address_1: hubInfo.address,
            phone: "+31644677890",
            city: hubInfo.city,
            country: hubInfo.country,
            postal_code: "1111",
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
    const createCartResult = await createCart(cartApi, cartRequest);
    if (!createCartResult) {
        throw new Error("A cart cannot be created.");
    }
    return createCartResult.id as string;
}

export async function getCreatedCart(cartApi: CartApi<any>, cartId: string) {
    const getCartResponse = await getCart(cartApi, cartId);
    if (!getCartResponse) {
        throw new Error("A cart does not exist.");
    }
    return getCartResponse;
}

export async function createAndCheckoutCartInStore(cartApi: CartApi<any>, cartRequest: CartRequest) {
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
    console.log(`${emojic.shoppingCart} The cart content is:`);
    console.log(cartRequest);

    const cartId = await createCartWithAssignedData(cartApi, cartRequest);
    await addShippingMethod(cartApi, cartId, clickAndCollect);

    const cart = await getCreatedCart(cartApi, cartId);
    const totalPrice = cart.totalPrice?.centAmount as number;

    spinnerSuccess();

    return await checkoutCart(cartApi, cartId, totalPrice);
}