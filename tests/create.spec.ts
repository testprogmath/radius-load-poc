import {afterAll, describe, expect, jest, test} from '@jest/globals';
import {create} from "../src/index.js";
import {execSync} from "child_process";
import {getConfigPath} from "../src/utils.js";

describe('Test create command', () => {
    jest.retryTimes(3, {logErrorsBeforeRetry: true});

    let options: { hub: string; email: string };

    beforeAll(async () => {
        const config = await getConfigPath();
        options = {
            hub: config.hubForTests,
            email: config.testEmail,
        };
        console.log("Initialized options:", options);

    });

    afterEach(async () => {
        // Wait for 1 sec before the next test
        await new Promise(resolve => {
            setTimeout(resolve, 1000);
        });
    });

    const createUniversalSpy = () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {
        });
        const debugSpy = jest.spyOn(console, 'debug').mockImplementation(console.log);

        const restoreAll = () => {
            logSpy.mockRestore();
            debugSpy.mockRestore();
        };

        return {logSpy, debugSpy, restoreAll};
    };

    test('Create an order with a specified hub', async () => {
        const {logSpy, restoreAll} = createUniversalSpy();

        try {
            const orderInfo = await create({
                hubSlug: options.hub,
                locale: 'en-de',
                isCLI: false,
                email: "flinkordtest@goflink.com"
            });

            expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("The cart is created with the id"));
            expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("The order is created!"));
            expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("The order number is"));
            expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("and the order id is"));

            console.log("Order info:", orderInfo);
            expect(orderInfo).toBeDefined();

        } catch (error) {
            console.error("Test failed:", error);
            throw error;
        } finally {
            restoreAll();
        }
    }, 70000);

    test('Create an order with a specified email', async () => {
        const {logSpy, restoreAll} = createUniversalSpy();

        const orderInfo = await create({
            hubSlug: options.hub,
            locale: 'en-de',
            isCLI: false,
            email: options.email
        });

        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(options.email));
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('The order is created!'));
        expect(logSpy).not.toHaveBeenCalledWith(expect.stringContaining('The cart is not assigned to the order. Please try later'));
        expect(orderInfo).toBeDefined();

        restoreAll();
    }, 70000);

    test('Create an order with clickAndCollect value', async () => {
        const {logSpy, restoreAll} = createUniversalSpy();
        await create({
            hubSlug: options.hub,
            locale: 'en-de',
            isCLI: false,
            email: options.email,
            clickAndCollect: true,
        });
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('The order is created!'));
        expect(logSpy).not.toHaveBeenCalledWith(expect.stringContaining('The cart is not assigned to the order. Please try later'));

        restoreAll();
    });

    test('Create an order with particular products', async () => {
        const {logSpy, restoreAll} = createUniversalSpy();

        const productsArray = '11017866:2,11017890:3,11018066:4';
        await create({
            hubSlug: options.hub,
            locale: 'en-de',
            isCLI: false,
            email: options.email,
            productsArray,
        });
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('11017866'));
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('11017890'));
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('11018066'));
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('The order is created!'));
        expect(logSpy).not.toHaveBeenCalledWith(expect.stringContaining('The cart is not assigned to the order. Please try later'));

        restoreAll();
    });

    test.failing('Create an in-store order', async () => {
        const {logSpy, restoreAll} = createUniversalSpy();
        await create({
            hubSlug: 'nl_ame_cent',
            locale: 'en-de',
            isCLI: false,
            email: options.email,
            inStore: true,
            productsArray: '13131245:2',
        });
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('The order is created!'));
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Attempt 1:Trying to get the payment done...'));
        expect(logSpy).not.toHaveBeenCalledWith(expect.stringContaining('The cart is not assigned to the order. Please try later'));

        restoreAll();
    }, 45000);

    test('Create an order with a deliveryTag "outdoor"', async () => {
        const {logSpy, restoreAll} = createUniversalSpy();
        await create({
            hubSlug: 'nl_ams_diem',
            locale: 'en-nl',
            isCLI: false,
            email: options.email,
            deliveryTag: 'outdoor',
        });
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("outdoor"));
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('The order is created!'));
        expect(logSpy).not.toHaveBeenCalledWith(expect.stringContaining('The cart is not assigned to the order. Please try later'));

        restoreAll();
    });


    test('Create an order with a specified country', async () => {
        const {logSpy, restoreAll} = createUniversalSpy();

        const orderInfo = await create({
            hubSlug: 'nl_ams_diem',
            country: 'nl',
            isCLI: false,
            email: options.email,
        });

        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('en-nl'));
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('The order is created!'));
        expect(orderInfo).toBeDefined();

        restoreAll();
    }, 70000);

    test('Error when both locale and country are specified', async () => {
        const {restoreAll} = createUniversalSpy();

        try {
            await create({
                hubSlug: 'nl_ams_diem',
                locale: 'en-nl',
                country: 'nl',
                isCLI: false,
                email: options.email,
            });
            throw new Error("Expected error was not thrown");
        } catch (error) {
            const err = error as Error;
            expect(err.message).toMatch(/You cannot specify both --locale and --country/);
        }

        restoreAll();
    }, 70000);

    afterAll(async () => {
        execSync(`flinkord free -h ${options.hub}`);
        execSync(`flinkord free -h nl_ame_cent`);
    });
});