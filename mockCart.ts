// import { Cart, FixedAmountDiscount } from "./discountModule"
// import { ItemType } from "./enum"
// import { Item } from "./interface"

// let tshirt: Item = {
//     name: "T-shirt",
//     type: ItemType.Clothing,
//     quantity: 1,
//     price: 350,
// }

// const hat: Item = {
//     name: "Hat",
//     type: ItemType.Clothing,
//     quantity: 1,
//     price: 250,
// }

// const watch: Item = {
//     name: "Watch",
//     type: ItemType.Accessories,
//     quantity: 1,
//     price: 850,
// }

// const bag: Item = {
//     name: "Bag",
//     type: ItemType.Accessories,
//     quantity: 1,
//     price: 640,
// }

// const belt: Item = {
//     name: "Belt",
//     type: ItemType.Accessories,
//     quantity: 1,
//     price: 230,
// }

// function generateCart(): Cart {
//     let items: Item[] = [tshirt, hat, watch, bag, belt];
//     return new Cart(items);
// }

// function printPrices(cart: Cart): void {
//     cart.items.forEach(item => {
//         console.log(`${item.name}: ${item.price}`);
//     });
//     console.log(`Total: ${cart.total}`);
// }

// // let cart = generateCart();
// const cart = new Cart([
//     { name: 'T-shirt', type: ItemType.Clothing , quantity: 2, price: 20 },
//     // { name: 'Jeans', type: ItemType.Clothing, quantity: 1, price: 50 },
//     // { name: 'Belt', type: ItemType.Accessories, quantity: 1, price: 80 },
//     // { name: 'Ring', type: ItemType.Ac`cessories, quantity: 2, price: 100 },
// ]);
// printPrices(cart);
// let fixedAmountDiscount = new FixedAmountDiscount(10);
// // let percentageDiscount = new PercentageDiscount(10);

// // let percentageDiscountByCategory = new PercentageDiscountByCategory(10, ItemType.Clothing);
// // let discountByPoint = new DiscountByPoint(10).applyDiscount(cart);

// // let specialCampaignDiscount = new SpecialCampaignDiscount(1000, 100);

// cart.selectDiscount(fixedAmountDiscount);
// // cart.selectDiscount(percentageDiscountByCategory);
// // cart.selectDiscount(specialCampaignDiscount);

// cart.calculateFinalPrice();
// console.log(`Total based discount: ${cart.total}`);
// console.log(`Item based discount: ${cart.items.reduce((acc, item) => acc + item.price, 0)}`);
