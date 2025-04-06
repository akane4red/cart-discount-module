import fs from 'fs';    
import { z } from 'zod';
import Cart from './cartModule';
import { FixedAmountDiscount, PercentageDiscount, PercentageDiscountByCategory, DiscountByPoint, SpecialCampaignDiscount } from './discountModule';
import { DiscountType, ItemType } from './enum';
import { Item } from './interface';

const ItemSchema = z.object({
    name: z.string(),
    type: z.nativeEnum(ItemType),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
});
const DiscountSchema = z.object({
    type: z.nativeEnum(DiscountType),
    discount: z.number().positive(), 
    category: z.nativeEnum(ItemType).optional(),
    every: z.number().int().optional()
});

const InputSchema = z.object({
    items: z.array(ItemSchema),
    discounts: z.array(DiscountSchema)
});

function handleUserInput(path: string): void {
    const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
    const parsedData = InputSchema.safeParse(data);
    if (!parsedData.success) {
        new Error("Invalid input data format");
        console.error("Error parsing input data:", parsedData.error.format());
        return;
    }
    const cart = createCart(data.items);
    applyDiscounts(cart, data.discounts);
    console.log("Cart:", cart.items);
    console.log("Avaliable Discounts: ", cart.avaliableDiscounts);
    console.log("Selected Discounts: ", cart.getSelectedDiscounts());
    console.log("Total:", cart.total);
    cart.calculateFinalPrice();
    console.log("Final Price:", cart.total);
}

function createCart(items: Item[]): Cart {
    const cartItems: Item[] = items.map(item => {
        if (!Object.values(ItemType).includes(item.type)) {
            throw new Error(`Invalid item type: ${item.type}`);
        }
        return {
            name: item.name,
            type: item.type,
            quantity: item.quantity,
            price: item.price
        };
    });
    return new Cart(cartItems);
}

function applyDiscounts(cart: Cart, discounts: any[]): void {
    // Note: The coupon get overwrites when applying the discount with the same category 
    // i.e. 
    //  [
    //    FixedAmountDiscount,
    //    PercentageDiscount,
    //    PercentageDiscountByCategory,
    //    DiscountByPoint,
    //    SpecialCampaignDiscount
    //  ]
    // will be redueced to
    // [
    //    PercentageDiscount,
    //    DiscountByPoint,
    //    SpecialCampaignDiscount
    //  ]

    // where PercentageDiscount overwrites FixedAmountDiscount
    // and PercentageDiscountByCategory overwrites DiscountByPoint

    discounts.forEach(discount => {
        switch(discount.type) {
            case 'FixedAmountDiscount':
                cart.selectDiscount(new FixedAmountDiscount(discount.discount));
                break;
            case 'PercentageDiscount':
                cart.selectDiscount(new PercentageDiscount(discount.discount));
                break;
            case 'PercentageDiscountByCategory':
                cart.selectDiscount(new PercentageDiscountByCategory(discount.discount, discount.category));
                break;
            case 'DiscountByPoint':
                cart.selectDiscount(new DiscountByPoint(discount.discount));
                break;
            case 'SpecialCampaignDiscount':
                cart.selectDiscount(new SpecialCampaignDiscount(discount.discount, discount.every));
                break;
            default:
                throw new Error(`Unknown discount type: ${discount.type}`);
        }
        cart.selectDiscount(discount);
    });
};

try {
    handleUserInput("./input.json");
} catch (error) {
    console.error("Error handling user input:", error);
}