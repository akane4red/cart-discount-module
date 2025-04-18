to run 

```
npm install
npx ts-node inputHandler.ts
```

Prepare the input file to similar format:
````
{
  "items": [
    { "name": "T-shirt", "type": "Clothing", "quantity": 2, "price": 50 },
    { "name": "Jeans", "type": "Clothing", "quantity": 1, "price": 100 }
  ],
  "discounts": [
    { "type": "FixedAmountDiscount", "discount": 10 },
    { "type": "PercentageDiscount", "discount": 10 },
    { "type": "PercentageDiscountByCategory", "discount": 20, "category": "Clothing" },
    { "type": "DiscountByPoint", "discount": 20 },
    { "type": "SpecialCampaignDiscount", "discount": 20, "every": 200 }
  ]
}
````

Testing

```
npm test
```
