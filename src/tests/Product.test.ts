import { Product, ProductCatalog, ProductSKU } from "../models/Product";

type TestSKU = ProductSKU | "test" | "hdp";
const mockProduct = (sku: TestSKU, name: string, price: number) => new Product(sku as ProductSKU, name, price);

describe("Product", () => {
  it("creates a new product with all required fields", () => {
    const laptop = mockProduct("test", "Gaming Laptop", 999.99);

    // Basic product properties should match what we provided
    expect(laptop.sku).toBe("test");
    expect(laptop.name).toBe("Gaming Laptop");
    expect(laptop.price).toBe(999.99);
  });

  it("throws helpful errors for invalid products", () => {
    // Empty name
    expect(() => mockProduct("test", "", 10.0)).toThrow("Hey, products need actual names!");

    // Negative price
    expect(() => mockProduct("test", "Test Product", -10.0)).toThrow(
      "Come on, Test Product can't be free or negative priced!"
    );
  });

  it("handles floating point price precision correctly", () => {
    const product = mockProduct("test", "Test", 10.999);
    expect(product.price).toBe(11.0); // Should round to 2 decimal places
  });
});

describe("Product Catalog", () => {
  let catalog: ProductCatalog;

  beforeEach(() => {
    // Start with a fresh catalog for each test
    catalog = ProductCatalog.getInstance();
  });

  it("lets us add and retrieve products", () => {
    const headphones = mockProduct("hdp", "Wireless Headphones", 199.99);
    catalog.addProduct(headphones);

    const found = catalog.getProduct("hdp" as ProductSKU);
    expect(found).toEqual(headphones);
  });

  it("prevents duplicate products with the same SKU", () => {
    const product1 = mockProduct("test", "Original", 10.0);
    const product2 = mockProduct("test", "Duplicate", 20.0);

    catalog.addProduct(product1);
    expect(() => catalog.addProduct(product2)).toThrow(`Oops! We already have a Duplicate (SKU: test) in the catalog`);
  });

  describe("default catalog", () => {
    let defaultCatalog: ProductCatalog;

    beforeEach(() => {
      defaultCatalog = ProductCatalog.createDefault();
    });

    // Test each product separately for better readability and maintenance
    it("has the Super iPad correctly configured", () => {
      const ipad = defaultCatalog.getProduct("ipd");
      expect(ipad).toBeDefined();
      expect(ipad?.name).toBe("Super iPad");
      expect(ipad?.price).toBe(549.99);
    });

    it("has the MacBook Pro correctly configured", () => {
      const macbook = defaultCatalog.getProduct("mbp");
      expect(macbook).toBeDefined();
      expect(macbook?.name).toBe("MacBook Pro");
      expect(macbook?.price).toBe(1399.99);
    });

    it("has the Apple TV correctly configured", () => {
      const appleTV = defaultCatalog.getProduct("atv");
      expect(appleTV).toBeDefined();
      expect(appleTV?.name).toBe("Apple TV");
      expect(appleTV?.price).toBe(109.5);
    });

    it("has the VGA adapter correctly configured", () => {
      const adapter = defaultCatalog.getProduct("vga");
      expect(adapter).toBeDefined();
      expect(adapter?.name).toBe("VGA adapter");
      expect(adapter?.price).toBe(30.0);
    });
  });
});
