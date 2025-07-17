import { expect, Page } from "@playwright/test";
import { BasePage } from "@pages/BasePage"; // Adjust path as needed

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
    // If you need any additional CartPage setup, do here
  }

  /** Navigates to the cart using a visible Shopping Cart link or button */
  async goToCart(): Promise<void> {
    // You can adjust the selector to be more robust to your UI
    await this.page.click("text=shopping cart");
  }

  /** Sets the product quantity in the cart */
  async setProductQuantity(quantity: number): Promise<void> {
    const qtyInput = this.page.locator('input[data-role="cart-item-qty"]');
    await qtyInput.fill(quantity.toString());
    // Optionally, add a blur or wait for auto-update
    await qtyInput.blur();
  }

  /**
   * Asserts that the add-to-cart confirmation appears, optionally for a given product
   * @param productName Optional name of the product to verify in the confirmation message
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

// import { expect, Page } from '@playwright/test';
// import { BasePage } from '@pages/BasePage'; // adjust path if needed

// export class CartPage extends BasePage {
//   async goToCart(page: Page): Promise<void> {
//     await page.click("text=shopping cart");
//   }

//   async setProductQuantity(page: Page, quantity: number): Promise<void> {
//     const qtyInput = page.locator('input[data-role="cart-item-qty"]');
//     await qtyInput.fill(quantity.toString());
//   }
//   async assertAddToCartSuccess(productName?: string) {
//     const confirmationMessage = this.page.locator(
//       'div[data-bind="html: $parent.prepareMessageForHtml(message.text)"]'
//     );
//     const successMessage = this.page.locator(
//       'div[data-ui-id="message-success"]'
//     );
//     await expect(successMessage).toBeVisible({ timeout: 5000 });
//     await expect(confirmationMessage).toContainText("You added ", {
//       timeout: 10000,
//     });
//     if (productName) {
//       await expect(confirmationMessage).toContainText(
//         `You added ${productName} to your shopping cart`,
//         { timeout: 10000 }
//       );
//     }
//   }
// }
