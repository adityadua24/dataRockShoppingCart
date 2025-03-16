// Types of products we sell in our store
export type ProductSKU = "ipd" | "mbp" | "atv" | "vga";

/**
 * Represents a product in our store's inventory
 */
export class Product {
  constructor(public readonly sku: ProductSKU, public readonly name: string, private _price: number) {
    this.validateProduct();
  }

  private validateProduct(): void {
    if (!this.name?.trim()) {
      throw new Error("Hey, products need actual names!");
    }

    if (this._price <= 0) {
      throw new Error(`Come on, ${this.name} can't be free or negative priced!`);
    }
  }

  get price(): number {
    // Round to 2 decimal places to handle floating point precision issues
    return Math.round(this._price * 100) / 100;
  }
}

/**
 * Manages our store's product catalog - singleton class
 */
export class ProductCatalog {
  private static instance: ProductCatalog;
  private readonly products = new Map<ProductSKU, Product>();

  private constructor() {}

  static getInstance(): ProductCatalog {
    if (!ProductCatalog.instance) {
      ProductCatalog.instance = new ProductCatalog();
    }
    return ProductCatalog.instance;
  }

  addProduct(product: Product): void {
    if (this.products.has(product.sku)) {
      throw new Error(`Oops! We already have a ${product.name} (SKU: ${product.sku}) in the catalog`);
    }
    this.products.set(product.sku, product);
  }

  getProduct(sku: ProductSKU): Product | undefined {
    return this.products.get(sku);
  }

  /**
   * These are the products we're launching with - more can be added later
   */
  static createDefault(): ProductCatalog {
    const catalog = ProductCatalog.getInstance();

    // Our launch day product lineup
    const launchProducts = [
      new Product("ipd", "Super iPad", 549.99),
      new Product("mbp", "MacBook Pro", 1399.99),
      new Product("atv", "Apple TV", 109.5),
      new Product("vga", "VGA adapter", 30.0),
    ];

    launchProducts.forEach((product) => {
      try {
        catalog.addProduct(product);
      } catch (error) {
        // Skip duplicates during initialization
        console.warn(`Skipping duplicate product: ${product.name}`);
      }
    });

    return catalog;
  }
}
