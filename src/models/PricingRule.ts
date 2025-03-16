import { Product, ProductSKU } from "./Product";

/**
 * Base interface for all our pricing rules
 * Each rule knows how to calculate its own discount
 */
export interface PricingRule {
  calculateDiscount(items: Map<ProductSKU, number>, products: Map<ProductSKU, Product>): number;
}

/**
 * Buy X get Y free deal
 */
export class BuyXGetYFreeRule implements PricingRule {
  constructor(
    private readonly productSku: ProductSKU,
    private readonly buyQuantity: number,
    private readonly freeQuantity: number
  ) {}

  calculateDiscount(items: Map<ProductSKU, number>, products: Map<ProductSKU, Product>): number {
    const quantity = items.get(this.productSku) ?? 0;
    if (quantity < this.buyQuantity) return 0;

    const product = products.get(this.productSku);
    if (!product) return 0;

    // Calculate how many free items they get
    const sets = Math.floor(quantity / this.buyQuantity);
    const freeItems = sets * this.freeQuantity;

    return freeItems * product.price;
  }
}

/**
 * Bulk discount when buying more than X items
 */
export class BulkDiscountRule implements PricingRule {
  constructor(
    private readonly productSku: ProductSKU,
    private readonly minQuantity: number,
    private readonly discountedPrice: number
  ) {}

  calculateDiscount(items: Map<ProductSKU, number>, products: Map<ProductSKU, Product>): number {
    const quantity = items.get(this.productSku) ?? 0;
    if (quantity <= this.minQuantity) return 0;

    const product = products.get(this.productSku);
    if (!product) return 0;

    // Apply the discount to all items once the threshold is met
    return quantity * (product.price - this.discountedPrice);
  }
}

/**
 * Free bundled product with purchase (e.g., free VGA with MacBook)
 */
export class BundleDiscountRule implements PricingRule {
  constructor(private readonly triggerSku: ProductSKU, private readonly bundledSku: ProductSKU) {}

  calculateDiscount(items: Map<ProductSKU, number>, products: Map<ProductSKU, Product>): number {
    const triggerQuantity = items.get(this.triggerSku) ?? 0;
    if (triggerQuantity === 0) return 0;

    const bundledProduct = products.get(this.bundledSku);
    if (!bundledProduct) return 0;

    const bundledQuantity = items.get(this.bundledSku) ?? 0;
    // They get as many free bundled items as trigger items, up to how many they bought
    const freeItems = Math.min(triggerQuantity, bundledQuantity);

    return freeItems * bundledProduct.price;
  }
}

export class PricingRuleFactory {
  static createDefaultRules(): PricingRule[] {
    return [
      // 3 for 2 deal on Apple TVs
      new BuyXGetYFreeRule("atv", 3, 1),

      // Bulk discount on iPads (> 4 units)
      new BulkDiscountRule("ipd", 4, 499.99),

      // Free VGA adapter with every MacBook Pro
      new BundleDiscountRule("mbp", "vga"),
    ];
  }
}
