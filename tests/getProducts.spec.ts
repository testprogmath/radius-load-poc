import {describe, test} from "@jest/globals";
import {getProducts} from "../src/commands";

describe('Test getProducts command', () => {
    test('getProducts command for the existing hub', async () => {
        const productsList = await getProducts('en-de', 'de_ham_wint');
        const expectedSku = '11018913';

        const productExists = productsList?.some(product => product.sku === expectedSku);

        expect(productExists).toBe(true);
    });
});