import Cart from "./cartModule";
import { ItemType } from "./enum";
import { Discount } from "./interface";

class FixedAmountDiscount implements Discount {
    discount: number;

    constructor(discount: number) {
        if (discount <= 0) {
            throw new Error("FixedAmountDiscount cannot be <= 0");
        }
        this.discount = discount;
    }

    applyDiscount(cart: Cart): void {
        cart.total = cart.total - this.discount;
        console.log("Total after fixed discount:", cart.total);
    }
}

class PercentageDiscount implements Discount {
    discount: number;

    constructor(discount: number) {
        if (discount <= 0 || discount >= 100) {
            throw new Error("PercentageDiscount cannot be <= 0 or >= 100");
        }
        this.discount = discount;
    }
    applyDiscount(cart: Cart): void {
        console.log(`Applying percentage discount: ${this.discount}%`);
        cart.total = cart.total * (1 - this.discount / 100);
        console.log("Total after percentage discount:", cart.total);
    }
}

class PercentageDiscountByCategory implements Discount {
    discount: number;
    category: ItemType;

    constructor(discount: number, category: ItemType) {
        if (discount <= 0 || discount >= 100) {
            throw new Error("PercentageDiscountByCategory cannot be <= 0 or >= 100");
        }
        this.discount = discount;
        this.category = category;
    }
    applyDiscount(cart: Cart): void {
        const initialCatergoryPrice = cart.items.filter(item => item.type === this.category).reduce((acc, item) => acc + item.price * item.quantity, 0);
        console.log(`Applying percentage discount by category: ${this.discount}% for category: ${this.category}`);
        if (cart.couponDiscount) {
            if (cart.couponDiscount instanceof PercentageDiscount) {
                const priceAfterPercentageDiscount = initialCatergoryPrice * (1 - cart.couponDiscount.discount / 100);
                const priceAfterPercentageDiscountByCategory = priceAfterPercentageDiscount * (this.discount / 100);
                cart.total -= priceAfterPercentageDiscountByCategory;
                
            } else if (cart.couponDiscount instanceof FixedAmountDiscount) {
                const catergoryFixedDiscount = (initialCatergoryPrice / cart.total) * cart.couponDiscount.discount;
                const catergoryTotal = initialCatergoryPrice - catergoryFixedDiscount;
                const catergoryFinalDiscout = catergoryTotal * (this.discount / 100);
                cart.total -= catergoryFinalDiscout;
            }
            console.log("Total after percentage discount by category:", cart.total);
        } else {
            const discount = initialCatergoryPrice * this.discount / 100;
            cart.total -= discount;
            console.log("Total after percentage discount by category:", cart.total);
        }
    }
}

class DiscountByPoint implements Discount {
    discount: number;

    constructor(discount: number) {
        if (discount <= 0) {
            throw new Error("DiscountByPoint cannot be <= 0");
        }
        this.discount = discount;
    }

    applyDiscount(cart: Cart): void {
        console.log("Applying discount by points:", this.discount);
        const maxDiscount = cart.total * 0.2;
        this.discount = Math.min(this.discount, maxDiscount);
        cart.total = cart.total - this.discount;
        console.log("Total after discount by points:", cart.total);
    }
}

class SpecialCampaignDiscount implements Discount {
    discount: number;
    every: number;

    constructor(discount: number, every: number) {
        if (discount <= 0) {
            throw new Error("PercentageDiscount discount cannot be <= 0");
        }
        if (every <= 0) {
            throw new Error("PercentageDiscount every cannot be <= 0");
        }
        this.discount = discount;
        this.every = every;
    }

    applyDiscount(cart: Cart): void {
        console.log("Applying special campaign discount:", this.discount, "Every:", this.every);
        this.discount = (Math.floor(cart.total / this.every)) * this.discount;
        cart.items.forEach(item => {
            item.price = item.price - (item.price / cart.total) * this.discount;
        });
        cart.total = cart.total - this.discount;
        console.log("Total after special campaign discount:", cart.total);
    }
}

export { Cart, Discount, FixedAmountDiscount, PercentageDiscount, PercentageDiscountByCategory, DiscountByPoint, SpecialCampaignDiscount };