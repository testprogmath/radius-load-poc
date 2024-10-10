import fs from 'fs';
import {promisify} from 'util';

const readFile = promisify(fs.readFile);

export interface Product {
    sku: string;
    slug: string;
    variant_id: string;
}
