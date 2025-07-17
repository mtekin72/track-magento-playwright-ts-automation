import { expect, Page } from "@playwright/test";
import { BasePage } from "@pages/BasePage";

export class ProductListingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Clicks a random product from the list of product items
   */
  async selectRandomProduct(): Promise<void> {
    const products = this.page.locator(".product-item");
    const count = await products.count();

    if (count === 0) {
      throw new Error("No products found on the listing page!");
    }

    const random = Math.floor(Math.random() * count);
    const product = products.nth(random);

    await product.waitFor({ state: "visible", timeout: 5000 });
    await product.click();
  }
}

// import { expect, Page } from '@playwright/test';
// import { BasePage } from '@pages/BasePage';

// export class ProductListingPage extends BasePage {

//   async selectRandomProduct(page: Page): Promise<void> {
//   const products = page.locator('.product-item');
//   const count = await products.count();
//   const random = Math.floor(Math.random() * count);
//   const product = products.nth(random);
//   await product.click();

// }

// }
