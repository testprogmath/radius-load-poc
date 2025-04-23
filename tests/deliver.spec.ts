import { describe, expect, test } from 'vitest';
import { create, CreateOptions } from '../src/commands/create.js';
import { CartOrder } from '../src/api/cart-api.js';
import { deliver } from '../src/index.js';

const TEST_OPTIONS: CreateOptions = {
    locale: 'en-de',
    hubSlug: 'nl_ams_diem',
    email: 'flinkord@goflink.com',
    clickAndCollect: false,
    isCLI: true,
};

describe('Test deliver command', () => {
    test('CLI: Deliver an order by order id', async () => {
        const orderInfo = await create(TEST_OPTIONS) as CartOrder;
        const output = await deliver(orderInfo.id as string);

        expect(output).toContain(`The order ${orderInfo.id} is delivered!`);
    });

    test('CLI: Deliver an order by order number', async () => {
        const orderInfo = await create(TEST_OPTIONS) as CartOrder;
        const output = await deliver(orderInfo.number as string);

        expect(output).toContain(`The order ${orderInfo.id} is delivered!`);
    });
});