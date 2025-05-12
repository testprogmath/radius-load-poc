import { beforeAll, describe, expect, test } from 'vitest';
import { create, CreateOptions } from '../src/commands/create.js';
import { CartOrder } from '../src/api/cart-api.js';
import { pick } from '../src/index.js';
import {readAppConfig} from '../src/utils.js';

describe('Test create command', () => {
    let options: { hub: string; email: string };

    beforeAll(async () => {
        const config = await readAppConfig();
        options = {
            hub: config.hubForTests,
            email: config.testEmail,
        };
        console.log("Initialized options:", options);
    });

    test('Pick an order', async () => {
        const createOptions: CreateOptions = {
            locale: 'en-de',
            hubSlug: options.hub,
            email: options.email,
            clickAndCollect: false,
            isCLI: true,
        };

        const orderInfo = await create(createOptions) as CartOrder;

        expect(orderInfo?.state).toContain("Open");
        await pick(orderInfo.number as string, options.hub);
    }, 20_000);
});