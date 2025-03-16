import { ProductCatalog } from "./models/Product";
import { Checkout } from "./services/Checkout";

function main() {
  // Initialize catalog with default products
  const catalog = ProductCatalog.createDefault();

  // Example 1: 3 Apple TVs and 1 VGA adapter
  console.log("Example 1: 3 Apple TVs and 1 VGA adapter");
  const checkout1 = new Checkout(catalog);
  checkout1.scan("atv");
  checkout1.scan("atv");
  checkout1.scan("atv");
  checkout1.scan("vga");
  console.log(`Total: $${checkout1.total()}`); // Expected: $249.00

  // Example 2: 2 Apple TVs and 5 Super iPads
  console.log("\nExample 2: 2 Apple TVs and 5 Super iPads");
  const checkout2 = new Checkout(catalog);
  checkout2.scan("atv");
  checkout2.scan("ipd");
  checkout2.scan("ipd");
  checkout2.scan("atv");
  checkout2.scan("ipd");
  checkout2.scan("ipd");
  checkout2.scan("ipd");
  console.log(`Total: $${checkout2.total()}`); // Expected: $2718.95

  // Example 3: MacBook Pro, VGA adapter, and Super iPad
  console.log("\nExample 3: MacBook Pro, VGA adapter, and Super iPad");
  const checkout3 = new Checkout(catalog);
  checkout3.scan("mbp");
  checkout3.scan("vga");
  checkout3.scan("ipd");
  console.log(`Total: $${checkout3.total()}`); // Expected: $1949.98
}

// Run the examples if this file is executed directly
if (require.main === module) {
  main();
}
