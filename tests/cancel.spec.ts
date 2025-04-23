import { describe, expect, test, beforeEach } from 'vitest';
import { cancel } from '../src/index.js';
import { CartOrder } from '../src/api/cart-api.js';
import { createOrder } from './helpers/createOrder.js';
import { createConsoleSpy } from './utils/console-spy.js';

let orderInfo: CartOrder;

describe('Test cancel command', () => {
    beforeEach(async () => {
        const result = await createOrder({
            hubSlug: 'nl_ams_diem',
            email: 'flinkord@goflink.com',
            clickAndCollect: false,
            isCLI: true,
        });

        if (!result || typeof result !== 'object' || !('id' in result)) {
            throw new Error('Order creation failed: ' + String(result));
        }

        orderInfo = result;

        if (!orderInfo.id || !orderInfo.number) {
            throw new Error("Failed to create order: ID or Number is undefined");
        }
    });

    test('Cancel order by ID', async () => {
        const spy = createConsoleSpy();

        if (!orderInfo.id) {
            throw new Error("Order ID is undefined");
        }

        await cancel(orderInfo.id);

        expect(spy.logSpy).toHaveBeenCalledWith(expect.stringContaining(`The order ${orderInfo.id} is cancelled!`));

        spy.restoreAll();
    });

    test('Cancel order by number', async () => {
        const spy = createConsoleSpy();

        if (!orderInfo.number) {
            throw new Error("Order Number is undefined");
        }

        await cancel(orderInfo.number);

        expect(spy.logSpy).toHaveBeenCalledWith(expect.stringContaining(`The order ${orderInfo.id} is cancelled!`));

        spy.restoreAll();
    });
});
