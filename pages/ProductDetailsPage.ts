import { expect, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class ProductDetailsPage extends BasePage {
 
   async  selectSize(page: Page, size: string): Promise<void> {
    // First try aria-label
    try {
      await page.click(`.swatch-option[aria-label="${size}"]`);
    } catch {
      // As backup, try by visible text
      await page.click(`.swatch-option:has-text("${size}")`);
    }
  }
  
  async selectColor(page: Page, color: string): Promise<void> {
    await page.click(`div.swatch-option.color[aria-label="${color}"]`);
  }

  async addToCart(page: Page): Promise<void> {
    await page.click('button.action.tocart[title="Add to Cart"]', {
      timeout: 10000,
    });
  }
}
