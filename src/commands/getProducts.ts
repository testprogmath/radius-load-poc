import {getProductsForTheHub, Product} from "../api/catalog-api";

export async function getProducts(locale: string, hubSlug: string): Promise<Product[]> {
    try {
        return await getProductsForTheHub(locale, hubSlug);
    } catch (error) {
        console.error("Error while retrieving products:", error);
        return [];
    }
}