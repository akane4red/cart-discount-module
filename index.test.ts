import { Cart, Discount, DiscountByPoint, FixedAmountDiscount, PercentageDiscount, PercentageDiscountByCategory, SpecialCampaignDiscount } from "./discountModule";
import { ItemType } from "./enum";

describe('Testing discount module', () => {

    let cart: Cart;

    beforeEach(() => {
        // Total: 750
        cart = new Cart([
            { name: 'T-shirt', type: ItemType.Clothing , quantity: 2, price: 10 },
            { name: 'Jeans', type: ItemType.Clothing, quantity: 1, price: 50 },
            { name: 'Belt', type: ItemType.Accessories, quantity: 1, price: 80 },
            { name: 'Ring', type: ItemType.Accessories, quantity: 2, price: 100 },
            { name: 'Phone', type: ItemType.Electronics, quantity: 1, price: 150 },
            { name: 'Laptop', type: ItemType.Electronics, quantity: 1, price: 250 },
        ]);
    });

    test('Cart with no discount', () => {
        const cart = new Cart([
            { name: 'T-shirt', type: ItemType.Clothing , quantity: 2, price: 20 },
            { name: 'Jeans', type: ItemType.Clothing, quantity: 1, price: 50 },
            { name: 'Belt', type: ItemType.Accessories, quantity: 1, price: 80 },
            { name: 'Ring', type: ItemType.Accessories, quantity: 2, price: 100 },
        ]);
        cart.calculateFinalPrice();
        expect(cart.total).toBe(370);
    });

    describe('Testing single discount', () => {
        test('Cart with fixed discount', () => {
            // Discount: 10
            // Total: 740
            const fixedDiscount = new FixedAmountDiscount(10);
            cart.selectDiscount(fixedDiscount);
            cart.calculateFinalPrice();
            expect(cart.avaliableDiscounts).toEqual([fixedDiscount]);
            expect(cart.onTopDiscount).toBeNull();
            expect(cart.seasonalDiscount).toBeNull();
            expect(cart.total).toBe(740);
        });

        test('Cart with percentage discount', () => {
            // Discount: 20%
            // Total: 600
            const percent = 20;
            const percentageDiscount = new PercentageDiscount(percent);
            const originalTotal = cart.total;
            cart.selectDiscount(percentageDiscount);
            cart.calculateFinalPrice();
            expect(cart.total).toBe(600);
        });

        test('Cart with percentage discount by catergory', () => {
            // Discount: 10%
            // Category: Electronics
            // Discount: (150 + 250) * 10% = 40
            // Total: 710 
            const percent = 10;
            const discountItemType = ItemType.Electronics;
            const percentageDiscount = new PercentageDiscountByCategory(percent, discountItemType);
            const originalTotal = cart.total;
            const originalElectronicsTotal = cart.items.filter(item => item.type === discountItemType).reduce((acc, item) => acc + item.price * item.quantity, 0);
            cart.selectDiscount(percentageDiscount);
            cart.calculateFinalPrice();
            expect(cart.total).toBe(710);
        });

        test('Cart with percentage discount by catergory2', () => {
            // Discount: 10%
            // Category: Electronics
            // Discount: (150 + 250) * 10% = 40
            // Total: 710 

            cart = new Cart([
                { name: 'Phone', type: ItemType.Electronics, quantity: 2, price: 100 },
                { name: 'Laptop', type: ItemType.Electronics, quantity: 1, price: 100 },
            ]);

            const percent = 10;
            const discountItemType = ItemType.Electronics;
            const percentageDiscount = new PercentageDiscountByCategory(percent, discountItemType);
            const originalTotal = cart.total;
            const originalElectronicsTotal = cart.items.filter(item => item.type === discountItemType).reduce((acc, item) => acc + item.price * item.quantity, 0);
            cart.selectDiscount(percentageDiscount);
            cart.calculateFinalPrice();
            expect(cart.total).toBe(270);
        });

        describe('Testing discount by points', () => {
            test('When not exeed 20%', () => {
                // Discount: 100
                // Total: 650
                const points = 100;
                const discountByPoint = new DiscountByPoint(points);
                cart.selectDiscount(discountByPoint);
                cart.calculateFinalPrice();
                expect(cart.total).toBe(650);
            });
            test('When exeed 20%', () => {
                // Discount: 20%
                // Total: 600
                const points = 300;
                const discountByPoint = new DiscountByPoint(points);
                cart.selectDiscount(discountByPoint);
                cart.calculateFinalPrice();
                expect(cart.total).toBe(600);
            });
            
        });

        describe('Testing special campaign discount', () => {
            test('Discount 10 every 250', () => {
                // Discount: 10 every 250 = 30
                // Total: 720
                const discount = 10;
                const every = 250;
                const specialCampaignDiscount = new SpecialCampaignDiscount(discount, every);
                cart.selectDiscount(specialCampaignDiscount);
                cart.calculateFinalPrice();
                expect(cart.total).toBe(720);
            });
        });
    });

    describe('Testing multiple discounts', () => {
        // Fixed discount > Percentage discount by category > special campaign discount
        test('Fixed discount > Percentage discount by category > special campaign discount', () => {
            // Original total: 750
            // Discount: 50 + 10%  + 10 every 250

            const fixedDiscountAmount = 50;
            const fixedDiscount = new FixedAmountDiscount(fixedDiscountAmount);
            // Total: 700

            const percent = 10;
            const discountItemType = ItemType.Electronics;
            const percentageDiscount = new PercentageDiscountByCategory(percent, discountItemType);
            // total catergory / total = catergory propotion
            // 400/700 = 0.5714
            // proportion * fixed discount = catergory fixed discount (from initial fixed discount)
            // 0.5714 * 50 = 28.57
            // original catergory discount - catergory fixed discount = final category discount
            // 400 - 28.57 = 371.43
            // final category discount * percent discount = final category discount
            // 371.43 * 10% = 37.14

            // 700 - 37.14 = 662.86

            const discount = 10;
            const every = 250;
            const specialCampaignDiscount = new SpecialCampaignDiscount(discount, every);
            // Discount: 10 every 250 = 20
            // Total: 642.86

            cart.selectDiscount(fixedDiscount);
            cart.selectDiscount(percentageDiscount);
            cart.selectDiscount(specialCampaignDiscount);

            // Total: 642.86
            // Rounded: 643
            
            cart.calculateFinalPrice();
            expect(Math.round(cart.total)).toBe(643);
        });

        // Fixed discount > Discount by point > special campaign discount
        test('Fixed discount > Discount by point > special campaign discount', () => {
            // Original total: 750
            // Discount: 50 + 100 + 10 every 250

            const fixedDiscountAmount = 50;
            const fixedDiscount = new FixedAmountDiscount(fixedDiscountAmount);
            // Total: 700

            const points = 100;
            const discountByPoint = new DiscountByPoint(points);
            // Total: 600

            const discount = 10;
            const every = 250;
            const specialCampaignDiscount = new SpecialCampaignDiscount(discount, every);
            // Discount: 10 every 250 = 20
            // Total: 580

            cart.selectDiscount(fixedDiscount);
            cart.selectDiscount(discountByPoint);
            cart.selectDiscount(specialCampaignDiscount);

            // Total: 580
            
            cart.calculateFinalPrice();
            expect(cart.total).toBe(580);
        });

        // Percentage discount > Percentage discount by category > special campaign discount
        test('Percentage discount > Percentage discount by category > special campaign discount', () => {
            // Original total: 750
            // Discount: 20% + 10% + 10 every 250

            const percent = 20;
            const percentageDiscount = new PercentageDiscount(percent);
            // Total: 600

            const percentByCategory = 10;
            const discountItemType = ItemType.Electronics;
            const percentageDiscountByCategory = new PercentageDiscountByCategory(percentByCategory, discountItemType);
            // 400 * 20% = 80
            // 400 - 80 = 320
            // 320 * 10% = 32
            // 600 - 32 = 568
            
            // Total: 568

            const discount = 10;
            const every = 250;
            const specialCampaignDiscount = new SpecialCampaignDiscount(discount, every);
            // Discount: 10 every 250 = 20
            // Total: 548

            cart.selectDiscount(percentageDiscount);
            cart.selectDiscount(percentageDiscountByCategory);
            cart.selectDiscount(specialCampaignDiscount);

            // Total: 548
            
            cart.calculateFinalPrice();
            expect(cart.total).toBe(548);
        });

        // Percentage discount > Discount by point> special campaign discount
        test('Percentage discount > Discount by point > special campaign discount', () => {
            // Original total: 750
            // Discount: 20% + 100 + 10 every 250
            const percent = 20;
            const percentageDiscount = new PercentageDiscount(percent);
            // Total: 600

            const points = 100;
            const discountByPoint = new DiscountByPoint(points);
            // Total: 500

            const discount = 10;
            const every = 250;
            const specialCampaignDiscount = new SpecialCampaignDiscount(discount, every);
            // Discount: 10 every 250 = 20
            // Total: 480

            cart.selectDiscount(percentageDiscount);
            cart.selectDiscount(discountByPoint);
            cart.selectDiscount(specialCampaignDiscount);

            // Total: 480
            
            cart.calculateFinalPrice();
            expect(cart.total).toBe(480);
        });
    });

    test('Empty cart', () => {
        const emptyCart = new Cart([]);
        emptyCart.calculateFinalPrice();
        expect(emptyCart.total).toBe(0);
    });

    describe('Testing invalid discount', () => {
        describe('Fixed discount', () => {
            it('should throw error for discount < 0 ', () => {
                expect(() => {
                    new FixedAmountDiscount(-1);
                }).toThrow();
            });

            it('should throw error for discount = 0 ', () => {
                expect(() => {
                    new FixedAmountDiscount(0);
                }).toThrow();
            });

            it('should not throw error', () => {
                expect(() => {
                    new FixedAmountDiscount(1);
                }).not.toThrow();
            });
        });

        describe('Percentage discount', () => {
            it('should throw error for discount < 0 ', () => {
                expect(() => {
                    new PercentageDiscount(-1);
                }).toThrow();
            });

            it('should throw error for discount = 0 ', () => {
                expect(() => {
                    new PercentageDiscount(0);
                }).toThrow();
            });

            it('should throw error for discount > 100 ', () => {
                expect(() => {
                    new PercentageDiscount(101);
                }).toThrow();
            });

            it('should not throw error', () => {
                expect(() => {
                    new PercentageDiscount(1);
                }).not.toThrow();
            });
        });

        describe('Percentage discount by catergory', () => {
            it('should throw error for discount < 0 ', () => {
                expect(() => {
                    new PercentageDiscountByCategory(-1, ItemType.Clothing);
                }).toThrow();
            });

            it('should throw error for discount = 0 ', () => {
                expect(() => {
                    new PercentageDiscountByCategory(0, ItemType.Clothing);
                }).toThrow();
            });

            it('should throw error for discount > 100 ', () => {
                expect(() => {
                    new PercentageDiscountByCategory(101, ItemType.Clothing);
                }).toThrow();
            });

            it('should not throw error', () => {
                expect(() => {
                    new PercentageDiscountByCategory(1, ItemType.Clothing);
                }).not.toThrow();
            });
            
        });

        describe('Discount by points', () => {
            it('should throw error for points < 0 ', () => {
                expect(() => {
                    new DiscountByPoint(-1);
                }).toThrow();
            });

            it('should throw error for points = 0 ', () => {
                expect(() => {
                    new DiscountByPoint(0);
                }).toThrow();
            });

            it('should not throw error', () => {
                expect(() => {
                    new DiscountByPoint(1);
                }).not.toThrow();
            });
        });


        describe('Special campaign discount', () => {
            it('should throw error for discount < 0 ', () => {
                expect(() => {
                    new SpecialCampaignDiscount(-1, 250);
                }).toThrow();
            });

            it('should throw error for discount = 0 ', () => {
                expect(() => {
                    new SpecialCampaignDiscount(0, 250);
                }).toThrow();
            });

            it('should throw error for every < 0 ', () => {
                expect(() => {
                    new SpecialCampaignDiscount(10, -1);
                }).toThrow();
            });

            it('should throw error for every = 0 ', () => {
                expect(() => {
                    new SpecialCampaignDiscount(10, 0);
                }).toThrow();
            });

            it('should not throw error', () => {
                expect(() => {
                    new SpecialCampaignDiscount(1, 1);
                }).not.toThrow();
            });
        });
    });        

    describe('Testing large numbers', () => {
        test('Cart with very large total and fixed discount', () => {
            const cart = new Cart([
                { name: 'Super Computer', type: ItemType.Electronics, quantity: 1, price: 1_000_000_000 },
                { name: 'Luxury Car', type: ItemType.Electronics, quantity: 1, price: 2_000_000_000 },
            ]);
            const fixedDiscount = new FixedAmountDiscount(500_000_000);
            cart.selectDiscount(fixedDiscount);
            cart.calculateFinalPrice();
            expect(cart.total).toBe(2_500_000_000); // Total: 3B - 500M
        });

        test('Cart with very large total and percentage discount', () => {
            const largeCart = new Cart([
                { name: 'Super Computer', type: ItemType.Electronics, quantity: 1, price: 1_000_000_000 },
                { name: 'Luxury Car', type: ItemType.Electronics, quantity: 1, price: 2_000_000_000 },
            ]);
            const percentageDiscount = new PercentageDiscount(10);
            largeCart.selectDiscount(percentageDiscount);
            largeCart.calculateFinalPrice();
            expect(largeCart.total).toBe(2_700_000_000); // Total: 3B - 10%
        });

        test('Cart with very large total and multiple discounts with overwrite', () => {
            const largeCart = new Cart([
                { name: 'Super Computer', type: ItemType.Electronics, quantity: 1, price: 1_000_000_000 },
                { name: 'Luxury Car', type: ItemType.Electronics, quantity: 1, price: 2_000_000_000 },
            ]);
            const fixedDiscount = new FixedAmountDiscount(500_000_000);
            const percentageDiscount = new PercentageDiscount(10);
            const specialCampaignDiscount = new SpecialCampaignDiscount(100_000_000, 1_000_000_000); // Discount: 100M every 1B

            largeCart.selectDiscount(fixedDiscount);
            largeCart.selectDiscount(percentageDiscount); // Overwrite previous FixedDiscount
            largeCart.selectDiscount(specialCampaignDiscount);
            largeCart.calculateFinalPrice();

            // Total:
            // Percentage Discount: 10% of 3B = 300M
            // 3B - 300M = 2.7B
            // Special campaign: 100M for every 1B = 200M
            // 2.7B - 200M = 2.5B
            expect(largeCart.total).toBe(2_500_000_000); // Final total: 2.05B
        });

        test('Cart with very large total and multiple discounts', () => {
            const largeCart = new Cart([
                { name: 'Super Computer', type: ItemType.Electronics, quantity: 2, price: 1_000_000_000 },
                { name: 'Luxury Car', type: ItemType.Electronics, quantity: 1, price: 2_000_000_000 },
            ]);
            const percentageDiscount = new PercentageDiscount(10);
            // Total: 4B - 10% = 3.6B
            const discountByPoint = new DiscountByPoint(100_000_000); 
            // Total: 3.6B - 100M = 3.5B
            const specialCampaignDiscount = new SpecialCampaignDiscount(100_000_000, 1_000_000_000); // Discount: 100M every 1B
            // Discount: 100M every 1B = 300M
            // Total: 3.5B - 300M = 3.2B

            largeCart.selectDiscount(percentageDiscount);
            largeCart.selectDiscount(discountByPoint);
            largeCart.selectDiscount(specialCampaignDiscount);
            largeCart.calculateFinalPrice();
            expect(largeCart.total).toBe(3_200_000_000); // Final total: 2.05B
        });
    });

});