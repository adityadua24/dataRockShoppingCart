import { Product, ProductCatalog, ProductSKU } from "../models/Product";
import { PricingRule, BuyXGetYFreeRule, BulkDiscountRule, BundleDiscountRule } from "../models/PricingRule";

export class Checkout {
  // Keep track of what's in the cart
  private cart = new Map<ProductSKU, number>();
  private readonly catalog: ProductCatalog;
  private readonly pricingRules: PricingRule[];

  constructor(catalog?: ProductCatalog) {
    // Use the provided catalog or create a default one
    this.catalog = catalog ?? ProductCatalog.createDefault();

    // Initialize default pricing rules
    this.pricingRules = [
      new BuyXGetYFreeRule("atv", 3, 1), // 3 for 2 deal on Apple TVs
      new BulkDiscountRule("ipd", 4, 499.99), // Bulk discount on iPads
      new BundleDiscountRule("mbp", "vga"), // Free VGA with MacBook Pro
    ];
  }

  /**
   * Scan an item and add it to the cart
   */
  scan(sku: ProductSKU): void {
    // Make sure the product exists before adding it
    const product = this.catalog.getProduct(sku);
    if (!product) {
      throw new Error(`Oops! Can't find product with SKU: ${sku}`);
    }

    // Update quantity in cart
    const currentQty = this.cart.get(sku) ?? 0;
    this.cart.set(sku, currentQty + 1);
  }

  /**
   * Calculate the total price for all items in the cart
   */
  total(): number {
    let total = this.calculateSubtotal();

    // Apply each pricing rule to get discounts
    const totalDiscount = this.pricingRules.reduce((sum, rule) => {
      return sum + rule.calculateDiscount(this.cart, this.getProductMap());
    }, 0);

    // Apply discounts and round to 2 decimal places
    return Math.round((total - totalDiscount) * 100) / 100;
  }

  private calculateSubtotal(): number {
    let subtotal = 0;

    // Add up regular prices for all items
    for (const [sku, quantity] of this.cart.entries()) {
      const product = this.catalog.getProduct(sku);
      if (product) {
        subtotal += product.price * quantity;
      }
    }

    return subtotal;
  }

  private getProductMap(): Map<ProductSKU, Product> {
    const products = new Map<ProductSKU, Product>();

    // Only include products that are actually in the cart
    for (const sku of this.cart.keys()) {
      const product = this.catalog.getProduct(sku);
      if (product) {
        products.set(sku, product);
      }
    }

    return products;
  }
}
