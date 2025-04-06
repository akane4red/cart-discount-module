import Cart from "./cartModule";
import { ItemType } from "./enum";

export interface Discount {
    discount: number;
    applyDiscount(cart: Cart): void;
}

export interface Item {
    name: string,
    type: ItemType,
    quantity: number,
    price: number,
}