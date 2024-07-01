import {expect, test} from "@jest/globals";
import {create, CreateOptions} from "../src/commands/create";
import {CartOrder} from "../src/api/cart-api";
import {pick} from "../src"

test('Pick an order', async () => {
    let orderInfo;
    const options: CreateOptions = {
        locale: 'en-de',
        hubSlug: 'de_ham_wint',
        email: 'flinkord@goflink.com',
        clickAndCollect: false,
        isCLI: true,
        productsArray: '14007689:3,11019025:4'
    };
    orderInfo = await create(options) as CartOrder;
    expect(orderInfo?.state).toContain("Open");
    await pick(orderInfo.number as string, "de_ham_wint");
}, 20000);