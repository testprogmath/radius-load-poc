import {describe, expect, test} from "@jest/globals";
import {create, CreateOptions} from "../src/commands/create";
import {CartOrder} from "../src/api/cart-api";
import {deliver} from "../src/commands";

describe('Test deliver command', () => {


    test('CLI: Deliver an order', async () => {
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
});