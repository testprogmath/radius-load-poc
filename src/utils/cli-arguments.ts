export function parseProductsArray(productsArray: string): Record<string, number> {
    // Parse the productsArray string and create the object
    const result: Record<string, number> = {};

    if (productsArray) {
        // Split the productsArray string by commas
        const productPairs = productsArray.split(',');

        // Iterate over the product pairs and extract the sku and quantity
        productPairs.forEach((pair) => {
            const [sku, quantity] = pair.split(':');
            result[sku] = parseInt(quantity);
        });
    }

    return result;
}