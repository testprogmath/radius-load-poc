import {CartApi, CartOrder} from "./api/cart-api";
import {LegacyHubDetailsService} from "@flink/hub-manager";
import {spinnerError, stopSpinner} from "./spinner";
import {printErrorAndStopSpinner} from "./utils";
import chalk from "chalk";
import {Colors} from "./shared/enums";
import {getProducts} from "./api/catalog-api";
import {Hubs} from "./shared/hubs";

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

export async function createCart(customerDomainApi: CartApi<any>, cartRequest: any) {
    let response;
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
    return response?.data;
}

export async function addShippingMethod(customerDomainApi: CartApi<any>, cartId: string, clickAndCollect = false) {
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
    let response
    try {
        response = await customerDomainApi.v3.getCartV3(cartId);
        if (response.status === 200) {
            console.log(`The cart is created with the id ${chalk.hex(Colors.MEXICAN_PINK)(cartId)}`);
        }
        console.log();
    } catch
        (e) {
        printErrorAndStopSpinner(e);
    }
    return response?.data;
}

export async function checkoutCart(customerDomainApi: CartApi<any>, cartId: string, totalPrice: number): Promise<CartOrder | undefined> {
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
                }
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


async function checkIfOrderIsCreated(customerDomainApi: CartApi<any>, cartId: string) {
    const MAX_RETRIES = 10;
    let retry = 0;
    let getCartResponse = await customerDomainApi.v3.getCartV3(cartId);
    let order;
    if (getCartResponse.status === 200) {
        // it takes 1-2 seconds sometimes to assign the order id to the cart
        while (retry < MAX_RETRIES) {
            getCartResponse = await customerDomainApi.v3.getCartV3(cartId);
            if (getCartResponse.data.order) break;
            retry++;
        }
        order = getCartResponse.data.order;
        if (!order) {
            console.log("The cart is not assigned to the order. Please try later");
            spinnerError("Your request failed. Please find the stacktrace above");
            stopSpinner();
            return;
        }
        console.log(`${emojic.memo} The order number is ${chalk.hex(Colors.LAVENDER_PINK).bold(order?.number)} and the order id is ${chalk.hex(Colors.THULIAN_PINK).bold(order?.id)}`);
    } else console.log("Something went wrong. Please check the logs and try later.");
    return order;
}

export async function addProductLines(emptyCartRequest: any, hubSlug: string, locale: string, numberOfProducts: number) {
    console.log(`${emojic.grapes} Setting products available in the hub...\n`);
    try {
        const products = await getProducts(locale, hubSlug);
        if (numberOfProducts > 0) {
            for (let i = 0; i < numberOfProducts; i++) {
                emptyCartRequest.lines[i].variant_id = products[i].sku;
                emptyCartRequest.lines[i].product_sku = products[i].sku;
                emptyCartRequest.lines[i].quantity = 2;
            }
        } else console.log("Please enter a positive number of products!");
    } catch
        (e) {
        printErrorAndStopSpinner(e);
    }
    return emptyCartRequest;
}


export async function setDeliveryAddress(emptyCartRequest: any, hubSlug: string): Promise<any> {
    try {
        const hubInfo = await LegacyHubDetailsService.getHubDetailsWithSlugRequest({hubSlug: hubSlug});

        let hubCoordinates = Hubs[hubSlug];

        if (!hubCoordinates) {
            // @ts-ignore
            hubCoordinates = hubInfo.turfs[0][2];
        }

        if (!hubCoordinates || !hubCoordinates.latitude || !hubCoordinates.longitude) {
            return 'Unable to find hub coordinates';
        }

        emptyCartRequest.delivery_coordinates = {
            latitude: hubCoordinates.latitude,
            longitude: hubCoordinates.longitude
        }

        emptyCartRequest.shipping_address = {
            street_address_1: hubInfo.address,
            city: hubInfo.city,
            country: hubInfo.country,
            postal_code: "1111"
        }
    } catch (e) {
        printErrorAndStopSpinner(e);
    }

    return emptyCartRequest;
}

export function setEmail(emptyCartRequest: any, email: string) {
    console.log(`${emojic.outboxTray} Setting the email to receive notifications about your order...\n`);
    emptyCartRequest.email = email;
    return emptyCartRequest;
}