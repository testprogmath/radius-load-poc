import {Api} from "./Api";

const cartToken = require('../resources/fixtures/cart_checkout_token.json');


export async function createCart(customerDomainApi: Api<any>, cartRequest: any) {
    let response = await customerDomainApi.v3.createCartV3(cartRequest);
    if (response.status === 200) {
        let cartId = response.data.id as string;
        console.log(`The cart is created with the id ${cartId}`);

    }
    return response.data;
}

export async function addShippingMethod(customerDomainApi: Api<any>, cartId: string, clickAndCollect: boolean = false) {
    const response = await customerDomainApi.v2.setShippingMethodV2(cartId, {clickAndCollect: clickAndCollect});
    if (response.status === 200) {
        console.log(`The shipping method is assigned, clickAndCollect is ${clickAndCollect}`);
    }
}

export async function getCart(customerDomainApi: Api<any>, cartId: string) {
    let response = await customerDomainApi.v3.getCartV3(cartId);
    if (response.status === 200) {
        console.log(`The cart is created with the id ${cartId}`);
    }
    return response.data;
}

export async function checkoutCart(customerDomainApi: Api<any>, cartId: string, totalPrice: number) {
    cartToken.amount.value = totalPrice;
    let response = await customerDomainApi.v3.checkoutV3(cartId, {
            "amount": totalPrice,
            "token": JSON.stringify(cartToken)
        }
    );
    if (response.status === 200) {
        console.log(`The order is created!`);
       await checkIfOrderIsCreated(customerDomainApi, cartId);
    }
    return response.data;
}


async function checkIfOrderIsCreated(customerDomainApi: Api<any>, cartId: string) {
    const MAX_RETRIES = 3;
    let retry = 0;
    let getCartResponse = await customerDomainApi.v3.getCartV3(cartId);
    if (getCartResponse.status === 200) {
        // it takes 1-2 seconds sometimes to assign the order id to the cart
        while (retry < MAX_RETRIES) {
            getCartResponse = await customerDomainApi.v3.getCartV3(cartId);
            if (getCartResponse.data.order) break;
            retry++;
        }
        const order = getCartResponse.data.order;
        if (!order) console.log("The cart is not assigned to the order. Please try later");
        console.log(`The order number is ${order?.number} and the order id is ${order?.id}`);
    } else console.log("Something went wrong. Please check the logs and try later.")
}

