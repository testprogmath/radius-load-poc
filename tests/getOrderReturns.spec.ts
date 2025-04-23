import { describe, test, expect } from 'vitest';
import { getOrderReturns } from '../src/index.js';
import { ReturnItem } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/order.js';

const RETURN_ORDER_ID = "77117298-172c-41ad-a02a-d061681d874a";
const RETURN_ORDER_SLUG = "de-ham-25jq-1aub";
const EXPECTED_COMMENT = "goods_not_on_shelf";
const EXPECTED_ITEM_COUNT = 2;

describe('Test getOrderReturns command', () => {
    test('getOrderReturns by ID command', async () => {
        const returnsInfo = await getOrderReturns(RETURN_ORDER_ID);

        expect(returnsInfo).toBeTruthy();
        expect(returnsInfo?.[0].items?.length).toEqual(EXPECTED_ITEM_COUNT);

        returnsInfo?.[0].items?.forEach((item: ReturnItem) => {
            expect(item.comment).toContain(EXPECTED_COMMENT);
        });
    });

    test('getOrderReturns by name command', async () => {
        const returnsInfo = await getOrderReturns(RETURN_ORDER_SLUG);

        expect(returnsInfo).toBeTruthy();
        expect(returnsInfo?.[0].items?.length).toEqual(EXPECTED_ITEM_COUNT);

        returnsInfo?.[0].items?.forEach((item: ReturnItem) => {
            expect(item.comment).toContain(EXPECTED_COMMENT);
        });
    });
});