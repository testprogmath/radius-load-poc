import {describe, expect, test} from "@jest/globals";
import {execSync} from "child_process";
import {create, CreateOptions} from "../src/commands/create";
import {CartOrder} from "../src/api/cart-api";

describe('Test cancel command', () => {
    jest.retryTimes(3, {logErrorsBeforeRetry: true});
    jest.setTimeout(15000);
    let orderInfo: CartOrder;
    beforeEach(async () => {
        const options: CreateOptions = {
            locale: 'en-de',
            hubSlug: "nl_ams_diem",
            email: 'flinkord@goflink.com',
            clickAndCollect: false,
            isCLI: true,
        };
        orderInfo = await create(options) as CartOrder;
    })
    test('CLI: Cancel order by id', async () => {
        const output = execSync(`flinkord cancel ${orderInfo.id}`).toString();
        console.log(output);
        expect(output).toContain((`The order ${orderInfo.id} is cancelled!`));
    });
    test('CLI: Cancel order by number', async () => {
        const output = execSync(`flinkord cancel ${orderInfo.number}`).toString();
        console.log(output);
        expect(output).toContain((`The order ${orderInfo.id} is cancelled!`));
    });
});