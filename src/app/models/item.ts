import { Product } from './product';

export interface Item {
    id?: string;
    fridge: string;
    barcode: string;
    product?: Product;
    created?: Date;
    expiry?: Date;
    qty: number;
}
