import {describe, expect, test, beforeEach} from "@jest/globals";
import {create, CreateOptions} from "../src/commands/create.js";
import {cancel} from "../src/index.js";
import {CartOrder} from "../src/api/cart-api.js";
import { jest } from '@jest/globals';

describe('Test cancel command', () => {
    jest.retryTimes(3, {logErrorsBeforeRetry: true});

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
        if (!orderInfo.id || !orderInfo.number) {
            throw new Error("Failed to create order: ID or Number is undefined");
        }
    });

    test('Cancel order by ID', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        if (!orderInfo.id) {
            throw new Error("Order ID is undefined");
        }

        await cancel(orderInfo.id);

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(`The order ${orderInfo.id} is cancelled!`));

        consoleSpy.mockRestore();
    }, 15000);

    test('Cancel order by number', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        if (!orderInfo.number) {
            throw new Error("Order Number is undefined");
        }

        await cancel(orderInfo.number);

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(`The order ${orderInfo.id} is cancelled!`));

        consoleSpy.mockRestore();
    }, 15000);
});