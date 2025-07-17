import { expect, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage'; // adjust path if needed

export class CartPage extends BasePage {
  async goToCart(page: Page): Promise<void> {
    await page.click("text=shopping cart");
  }

  async setProductQuantity(page: Page, quantity: number): Promise<void> {
    const qtyInput = page.locator('input[data-role="cart-item-qty"]');
    await qtyInput.fill(quantity.toString());
  }
  async assertAddToCartSuccess(productName?: string) {
    const confirmationMessage = this.page.locator(
      'div[data-bind="html: $parent.prepareMessageForHtml(message.text)"]'
    );
    const successMessage = this.page.locator(
      'div[data-ui-id="message-success"]'
    );
    await expect(successMessage).toBeVisible({ timeout: 5000 });
    await expect(confirmationMessage).toContainText("You added ", {
      timeout: 10000,
    });
    if (productName) {
      await expect(confirmationMessage).toContainText(
        `You added ${productName} to your shopping cart`,
        { timeout: 10000 }
      );
    }
  }
}
