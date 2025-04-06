import { Discount, FixedAmountDiscount, PercentageDiscount, PercentageDiscountByCategory, DiscountByPoint, SpecialCampaignDiscount } from "./discountModule";
import { Item } from "./interface";

class Cart {
    items: Item[] = [];
    avaliableDiscounts: Discount[] = [];
    total: number = 0;
    discounts: Discount[] = [];
    couponDiscount: Discount | null = null;
    onTopDiscount: Discount | null = null;
    seasonalDiscount: Discount | null = null;

    constructor(items: Item[] = []) {
        this.items = items
        this.total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }


    selectDiscount(discount: Discount): void {
        if (discount instanceof FixedAmountDiscount ||
            discount instanceof PercentageDiscount) {
            this.selectCouponDiscount(discount);
        } else if (discount instanceof PercentageDiscountByCategory ||
            discount instanceof DiscountByPoint) {
            this.selectOnTopDiscount(discount);
        } else if (discount instanceof SpecialCampaignDiscount) {
            this.selectSeasonalDiscount(discount);
        }
    }

    private selectCouponDiscount(discount: FixedAmountDiscount | PercentageDiscount): void {
        this.couponDiscount = discount;
        this.avaliableDiscounts.push(discount);
    }

    private selectOnTopDiscount(discount: PercentageDiscountByCategory | DiscountByPoint): void {
        this.onTopDiscount = discount;
        this.avaliableDiscounts.push(discount);
    }

    private selectSeasonalDiscount(discount: SpecialCampaignDiscount): void {
        this.seasonalDiscount = discount;
        this.avaliableDiscounts.push(discount);
    }

    getSelectedDiscounts(): Discount[] {
        return [this.couponDiscount, this.onTopDiscount, this.seasonalDiscount].filter(discount => discount !== null) as Discount[];
    }

    calculateFinalPrice(): void {
        if (this.couponDiscount) {
            this.couponDiscount.applyDiscount(this);
        }
        if (this.onTopDiscount) {
            this.onTopDiscount.applyDiscount(this);
        }
        if (this.seasonalDiscount) {
            this.seasonalDiscount.applyDiscount(this);
        }

        if (this.total < 0) {
            this.total = 0;
            this.items.map(item => {
                item.price = 0;
            });
        }

        this.total = Math.round(this.total);
    }
}

export default Cart;