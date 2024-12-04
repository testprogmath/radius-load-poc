import {describe, test} from "@jest/globals";
import {getOrderReturns} from "../src/index.js";
import {ReturnItem} from "@commercetools/platform-sdk/dist/declarations/src/generated/models/order.js";
describe('Test getOrderReturns command', () => {

    test('getOrderReturns by ID command', async () => {
        let returnsInfo = await getOrderReturns("77117298-172c-41ad-a02a-d061681d874a");
        if (returnsInfo) {
            expect(returnsInfo[0].items?.length).toEqual(2);
            returnsInfo[0].items.forEach((item: ReturnItem) => {
                expect(item.comment).toContain("goods_not_on_shelf");
            });
        }
    });
    test('getOrderReturns by name command', async () => {
        let returnsInfo = await getOrderReturns("de-ham-25jq-1aub");
        if (returnsInfo) {
            expect(returnsInfo[0].items?.length).toEqual(2);
            returnsInfo[0].items.forEach((item: ReturnItem) => {
                expect(item.comment).toContain("goods_not_on_shelf");
            })
        }
    });
});