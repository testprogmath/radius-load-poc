import {afterAll, describe, expect, test} from '@jest/globals';
import {create} from "../src/commands";
import {cancelOrder} from "../src/commercetools/ct-client";

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
        expect(output).toContain(`email: '${options.email}'`);
        expect(output).toContain('The order is created!');
        expect(output).not.toContain('The cart is not assigned to the order. Please try later');
        orderIds.push(getOrderId(output));


    });

    test('Create an order with an unknown hub', async () => {
        let orderInfo;
        orderInfo = await create('en-de', "test", 'flinkord@goflink.com');
        expect(orderInfo).toEqual("This hub does not exist!");
    });

    afterAll(async () => {
        for (const orderId of orderIds) {
            await cancelOrder(orderId);
        }
    });

    function getOrderId(output: string) {
        const words = output.split(' ');
        return words[words.length - 1];
    }
});
