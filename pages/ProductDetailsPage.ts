import { expect, Page } from "@playwright/test";
import { BasePage } from "@pages/BasePage";

export class ProductDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   Size selection
   */
  async selectSize(size: string): Promise<void> {
    try {
      await this.page.click(`.swatch-option[aria-label="${size}"]`);
    } catch {
      await this.page.click(`.swatch-option:has-text("${size}")`);
    }
  }

  /**
   Colour selection
   */
  async selectColor(color: string): Promise<void> {
    await this.page.click(`div.swatch-option.color[aria-label="${color}"]`);
  }

  async addToCart(): Promise<void> {
    await this.page.click('button.action.tocart[title="Add to Cart"]', {
      timeout: 10000,
    });
  }
}
