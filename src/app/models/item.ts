import { Product } from './product';

export interface Item {
    id?: string;
    fridge: string;
    barcode: string;
    product?: Product;
    created?: string;
    expiry?: string;
    qty: number;
}
