import {afterAll, describe, expect, test} from '@jest/globals';
import create from "../src/commands/create";
import {getOrderInfoById, updateOrder} from "../src/commercetools/ct-client";

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
            //get last version
            let orderInfo = await getOrderInfoById(orderId);
            //complete the order
            await updateOrder(orderId, orderInfo.body.version, {
                action: 'changeOrderState',
                orderState: "Complete"
            });

            orderInfo = await getOrderInfoById(orderId);
            await updateOrder(orderId, orderInfo.body.version, {
                action: 'transitionState',
                state: {
                    id: "0fa77453-da4d-4ace-a973-71082415d723",
                    typeId: "state"
                }
            })

            orderInfo = await getOrderInfoById(orderId);
            await updateOrder(orderId, orderInfo.body.version, {
                action: "changeShipmentState",
                shipmentState: "Delivered"
            });
            console.log(`The order ${orderId} is completed!`)
        }
    });

    function getOrderId(output: string) {
        const words = output.split(' ');
        return words[words.length - 1];
    }
});
