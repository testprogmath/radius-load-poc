import fs from 'fs';
import {promisify} from 'util';
import {parseStringPromise} from 'xml2js';
import {getItemStockInHub} from "./inventory-service-api";
import {DEFAULT_PRODUCTS_NUMBER} from "../utils/constants";
import {readCacheFile, writeCacheFile} from "../utils";

const readFile = promisify(fs.readFile);

export interface Product {
    sku: string;
    slug: string;
    variant_id: string;
}

export async function getProductsForTheHub(locale: string, hubSlug: string, numberOfProducts = DEFAULT_PRODUCTS_NUMBER): Promise<Product[]> {
    let filePath: string;
    switch (hubSlug.slice(0, 2).toLowerCase()) {
        case 'de':
            filePath = 'resources/fixtures/sitemap-products.en-DE.xml';
            break;
        case 'fr':
            filePath = 'resources/fixtures/sitemap-products.en-FR.xml';
            break;
        case 'nl':
            filePath = 'resources/fixtures/sitemap-products.en-NL.xml';
            break;
        default:
            throw new Error('Unsupported locale');
    }

    try {
            const cachedProducts = await readCacheFile(hubSlug);
            if (cachedProducts.length >= numberOfProducts) {
                return cachedProducts.slice(0, numberOfProducts);
            }

            const fileContent = await readFile(filePath, 'utf-8');
            const result = await parseStringPromise(fileContent);

            const products = result.urlset.url.map((urlObj: any) => {
                const loc = urlObj.loc[0];
                const sku = loc.substring(loc.lastIndexOf('-') + 1, loc.length - 1);
                return { sku, slug: '', variant_id: '' };
            });

            const validProducts: Product[] = [];
            for (const product of products) {
                const stockInfo = await getItemStockInHub(product.sku, hubSlug);
                if (stockInfo && stockInfo.results.length > 0 && stockInfo.results[0].sku) {
                    validProducts.push(product);
                    if (validProducts.length >= numberOfProducts) {
                        break;
                    }
                }
            }

            await writeCacheFile(hubSlug, validProducts);

        return validProducts;
    } catch (error) {
        console.error('Error reading or parsing the file:', error);
        throw error;
    }
}