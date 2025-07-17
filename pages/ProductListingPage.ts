import { expect, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class ProductListingPage extends BasePage {


  async selectRandomProduct(page: Page): Promise<void> {
  const products = page.locator('.product-item');
  const count = await products.count();
  const random = Math.floor(Math.random() * count);
  const product = products.nth(random);
  await product.click();

}

}
 