import {describe, expect, test} from "@jest/globals";
import {create, CreateOptions} from "../src/commands/create.js";
import {CartOrder} from "../src/api/cart-api.js";
import {deliver} from "../src/index.js";

describe('Test deliver command', () => {

    test('CLI: Deliver an order by order id', async () => {
        let orderInfo;
        const options: CreateOptions = {
            locale: 'en-de',
            hubSlug: "nl_ams_diem",
            email: 'flinkord@goflink.com',
            clickAndCollect: false,
            isCLI: true,
        };
        orderInfo = await create(options) as CartOrder;
        const output = await deliver(orderInfo.id as string);
        expect(output).toContain(`The order ${orderInfo.id} is delivered!`)
    }, 10000);

    test('CLI: Deliver an order by order number', async () => {
        let orderInfo;
        const options: CreateOptions = {
            locale: 'en-de',
            hubSlug: "nl_ams_diem",
            email: 'flinkord@goflink.com',
            clickAndCollect: false,
            isCLI: true,
        };
        orderInfo = await create(options) as CartOrder;
        const output = await deliver(orderInfo.number as string);
        expect(output).toContain(`The order ${orderInfo.id} is delivered!`)
    }, 10000);
});