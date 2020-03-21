import { User } from './user';
import { Product } from './product';

export interface Fridge {
    id: string;
    name: string;
    owners?: User[];
}
