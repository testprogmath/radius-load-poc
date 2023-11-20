import {afterAll, describe, expect, test} from '@jest/globals';
import {create} from "../src";
import {CreateOptions} from "../src/commands/create";
import {CartOrder} from "../src/api/cart-api";

const {execSync} = require('child_process');
const config = require('config');
const options = {
    hub: config.get("hubForTests"),
    email: config.get("testEmail")
};

describe('Test create command', () => {
    jest.retryTimes(3, {logErrorsBeforeRetry: true});
    let orderIds: string[] = [];


    test('CLI: Create an order with a specified hub', async () => {
        const output = execSync(`flinkord create --hub ${options.hub}`).toString();
        console.log(output);
        expect(output).toContain(`The cart is created with the id`);
        expect(output).toContain('The order is created!');
        expect(output).toContain(`The order number is`);
        expect(output).toContain(`and the order id is `);
        expect(output).not.toContain('The cart is not assigned to the order. Please try later');
        const orderId = getOrderId(output)
        console.log(`The order id is: ${orderId}`);
        orderIds.push(orderId);
    });

    test('CLI: Create an order with a specified email', async () => {
        const output = execSync(`flinkord create --hub ${options.hub} -m ${options.email}`).toString();
        console.log(output);
        expect(output).toContain(`'${options.email}'`);
        expect(output).toContain('The order is created!');
        expect(output).not.toContain('The cart is not assigned to the order. Please try later');
        orderIds.push(getOrderId(output));
    });

    test('CLI: Create an order with clickAndCollect value', async () => {
        const output = execSync(`flinkord create --hub ${options.hub} -s true`).toString();
        console.log(output);
        expect(output).toContain('The order is created!');
        expect(output).not.toContain('The cart is not assigned to the order. Please try later');
        const orderId = getOrderId(output)
        console.log(`The order id is: ${orderId}`);
        orderIds.push(orderId);
    });

    test('CLI: Create an order with particular products', async () => {
        const output = execSync(`flinkord create --hub ${options.hub} -p 15012024:2,11014933:3,11013382:4`).toString();
        // console.log(output);
        expect(output).toContain("'11013382'");
        expect(output).toContain("'11014933'");
        expect(output).toContain("'15012024'");
        expect(output).toContain('The order is created!');
        expect(output).not.toContain('The cart is not assigned to the order. Please try later');
        const orderId = getOrderId(output)
        console.log(`The order id is: ${orderId}`);
        orderIds.push(orderId);
    });


    test('CLI: Create an in-store order', async () => {
        const output = execSync(`flinkord create --hub fr_par_lepe --instore`).toString();
        console.log(output);
        expect(output).toContain('instore');
        expect(output).toContain('The order is created!');
        expect(output).not.toContain('The cart is not assigned to the order. Please try later');
        const orderId = getOrderId(output)
        console.log(`The order id is: ${orderId}`);
        orderIds.push(orderId);
    });

    test('CLI: Create an order with a deliveryTag "outdoor" ', async () => {
        const output = execSync(`flinkord create --hub fr_par_lepe -d outdoor`).toString();
        const consoleSpy = jest.spyOn(console, 'log');

        console.log(output);
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('outdoor'));

        // expect(output).toContain('tag: \'outdoor\'');
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('The order is created!'));

        // expect(output).toContain('The order is created!');
        expect(output).not.toContain('The cart is not assigned to the order. Please try later');
        const orderId = getOrderId(output)
        console.log(`The order id is: ${orderId}`);
        orderIds.push(orderId);
    });

    test('Create an order with an unknown hub', async () => {
        let orderInfo;
        const options: CreateOptions = {
            locale: 'en-de',
            hubSlug: 'test',
            email: 'flinkord@goflink.com',
            clickAndCollect: false,
            isCLI: true,
            productsArray: '14007689:3,11019025:4'
        };
        orderInfo = await create(options);
        expect(orderInfo).toEqual("This hub does not exist!");
    });

    test('Create an order with productsArray', async () => {
        let orderInfo;
        const options: CreateOptions = {
            locale: 'en-de',
            hubSlug: 'de_ham_wint',
            email: 'flinkord@goflink.com',
            clickAndCollect: false,
            isCLI: true,
            productsArray: '14007689:3,11019025:4'
        };
        orderInfo = await create(options) as CartOrder;
        expect(orderInfo?.state).toContain("Open");
    });

    afterAll(async () => {
        execSync(`flinkord free -h ${options.hub}`);
        execSync(`flinkord free -h 'fr_par_lepe'`)
    });

    function getOrderId(output: string) {
        const words = output.split(' ');
        return words[words.length - 1];
    }
});
