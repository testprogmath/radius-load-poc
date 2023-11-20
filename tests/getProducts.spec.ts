import {describe, test} from "@jest/globals";
import {getProducts} from "../src/commands";

describe('Test getProducts command', () => {

    test('getProducts command for the existing hub', async () => {
        let productsList = await getProducts("en-de", "de_ham_wint");
        const expectedProduct = {
            sku: "11011576",
            slug: "zewa-toilettenpapier-ultra-soft-4-lagig-2-rollen",
            variant_id: "11011576"
        };
        const productExists = productsList?.some(product =>
            product.sku === expectedProduct.sku &&
            product.slug === expectedProduct.slug &&
            product.variant_id === expectedProduct.variant_id
        );
        expect(productExists).toBe(true);

    });

});