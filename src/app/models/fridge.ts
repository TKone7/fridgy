import { User } from './user';
import { Product } from './product';

export interface Fridge {
    id?: string;
    name: string;
    owner?: User[];
    creator?: User;
}
