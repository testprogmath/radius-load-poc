import {
    beforeAll,
    afterEach,
    afterAll,
    describe,
    expect,
    test,
} from 'vitest';
import { execSync } from 'node:child_process';
import { getConfigPath } from '../src/utils.js';
import { createOrder } from './helpers/createOrder.js';
import { createConsoleSpy } from './utils/console-spy.js';

let options: { hub: string; email: string };

describe('Test create command', () => {
    beforeAll(async () => {
        const config = await getConfigPath();
        options = {
            hub: config.hubForTests,
            email: config.testEmail,
        };
        console.log("Initialized options:", options);
    });

    afterEach(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    test('Create an order with a specified hub', async () => {
        const spy = createConsoleSpy();

        const orderInfo = await createOrder({
            hubSlug: options.hub,
            email: 'flinkordtest@goflink.com'
        });

        expect(spy.logSpy).toHaveBeenCalledWith(expect.stringContaining("The cart is created with the id"));
        expect(spy.logSpy).toHaveBeenCalledWith(expect.stringContaining("The order is created!"));
        expect(spy.logSpy).toHaveBeenCalledWith(expect.stringContaining("The order number is"));
        expect(spy.logSpy).toHaveBeenCalledWith(expect.stringContaining("and the order id is"));
        expect(orderInfo).toBeDefined();

        spy.restoreAll();
    });

    test('Create an order with a specified email', async () => {
        const spy = createConsoleSpy();

        const orderInfo = await createOrder({ email: options.email });

        expect(spy.logSpy).toHaveBeenCalledWith(expect.objectContaining({
            email: options.email,
        }));
        expect(spy.logSpy).toHaveBeenCalledWith(expect.stringContaining('The order is created!'));
        expect(spy.logSpy).not.toHaveBeenCalledWith(expect.stringContaining('The cart is not assigned to the order. Please try later'));
        expect(orderInfo).toBeDefined();

        spy.restoreAll();
    });

    test('Create an order with clickAndCollect value', async () => {
        const spy = createConsoleSpy();

        await createOrder({ email: options.email, clickAndCollect: true });

        expect(spy.logSpy).toHaveBeenCalledWith(expect.stringContaining('The order is created!'));
        expect(spy.logSpy).not.toHaveBeenCalledWith(expect.stringContaining('The cart is not assigned to the order. Please try later'));

        spy.restoreAll();
    });

    test('Create an order with particular products', async () => {
        const spy = createConsoleSpy();

        const productsArray = '11010068:2,11013569:3,11013592:4';
        await createOrder({ productsArray, email: options.email, hubSlug: 'de_ber_mit2' });
        ['11010068', '11013569', '11013592'].forEach(product =>
            expect(spy.logSpy).toHaveBeenCalledWith(expect.objectContaining({
                [product]: expect.any(Number)
            }))
        );
        expect(spy.logSpy).toHaveBeenCalledWith(expect.stringContaining('The order is created!'));
        expect(spy.logSpy).not.toHaveBeenCalledWith(expect.stringContaining('The cart is not assigned to the order. Please try later'));

        spy.restoreAll();
    });

    test.skip('Create an in-store order', async () => {
        const spy = createConsoleSpy();

        await createOrder({
            hubSlug: 'nl_ame_cent',
            inStore: true,
            productsArray: '13131245:2',
            email: options.email,
        });

        expect(spy.logSpy).toHaveBeenCalledWith(expect.stringContaining('The order is created!'));
        expect(spy.logSpy).toHaveBeenCalledWith(expect.stringContaining('Attempt 1:Trying to get the payment done...'));
        expect(spy.logSpy).not.toHaveBeenCalledWith(expect.stringContaining('The cart is not assigned to the order. Please try later'));

        spy.restoreAll();
    });

    test('Create an order with a deliveryTag "outdoor"', async () => {
        const spy = createConsoleSpy();

        await createOrder({
            hubSlug: 'nl_ams_diem',
            locale: 'en-nl',
            email: options.email,
            deliveryTag: 'outdoor'
        });

        expect(spy.logSpy).toHaveBeenCalledWith(expect.stringContaining("outdoor"));
        expect(spy.logSpy).toHaveBeenCalledWith(expect.stringContaining('The order is created!'));
        expect(spy.logSpy).not.toHaveBeenCalledWith(expect.stringContaining('The cart is not assigned to the order. Please try later'));

        spy.restoreAll();
    });

    test('Create an order with a specified country', async () => {
        const spy = createConsoleSpy();

        const orderInfo = await createOrder({
            hubSlug: 'nl_ams_diem',
            country: 'nl',
            email: options.email,
            locale: '',
        });

        expect(spy.logSpy).toHaveBeenCalledWith(expect.stringContaining('The order is created!'));
        expect(orderInfo).toBeDefined();

        spy.restoreAll();
    });

    test('Error when both locale and country are specified', async () => {
        const spy = createConsoleSpy();

        try {
            await createOrder({
                hubSlug: 'nl_ams_diem',
                locale: 'en-nl',
                country: 'nl',
                email: options.email,
            });
            throw new Error("Expected error was not thrown");
        } catch (error) {
            const err = error as Error;
            expect(err.message).toMatch(/You cannot specify both --locale and --country/);
        }

        spy.restoreAll();
    });

    afterAll(() => {
        execSync(`flinkord free -h ${options.hub}`);
        execSync(`flinkord free -h nl_ame_cent`);
    });
});
