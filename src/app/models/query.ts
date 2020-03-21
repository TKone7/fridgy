interface Order {
    column: string;
    dir: string;
}

interface Filter {
    field: string;
    value: string;
}

export interface Query {
    order?: Order;
    filter?: Filter;
}
