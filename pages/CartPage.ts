import { expect, Page } from "@playwright/test";
import { BasePage } from "@pages/BasePage"; // Adjust path as needed

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  /** Navigates to the cart */
  async goToCart(): Promise<void> {
    await this.page.click("text=shopping cart");
  }

  /** Set product quantity*/
  async setProductQuantity(quantity: number): Promise<void> {
    const qtyInput = this.page.locator('input[data-role="cart-item-qty"]');
    await qtyInput.fill(quantity.toString());
  }

  /**
   addToCart confirmation message appears
   */
  async assertAddToCartSuccess(productName?: string): Promise<void> {
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
