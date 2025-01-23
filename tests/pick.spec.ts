import {create, CreateOptions} from "../src/commands/create.js";
import {CartOrder} from "../src/api/cart-api.js";
import {pick} from "../src/index.js";
import {getConfigPath} from "../src/utils.js";
import {describe, expect, jest, test} from '@jest/globals';

describe('Test create command', () => {
    jest.retryTimes(3, { logErrorsBeforeRetry: true });
    let options: { hub: string; email: string };

    beforeAll(async () => {
        const config = await getConfigPath();
        options = {
            hub: config.hubForTests,
            email: config.testEmail,
        };
        console.log("Initialized options:", options);
    });

    test('Pick an order', async () => {
        let orderInfo;
        const createOptions: CreateOptions = { // Renamed the variable here
            locale: 'en-de',
            hubSlug: options.hub, // Use global 'options'
            email: options.email, // Use global 'options'
            clickAndCollect: false,
            isCLI: true,
        };
        orderInfo = await create(createOptions) as CartOrder;
        expect(orderInfo?.state).toContain("Open");
        await pick(orderInfo.number as string, options.hub);
    }, 20000);
});