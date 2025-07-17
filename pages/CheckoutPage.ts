
import { expect, Page, Locator } from "@playwright/test";
import { BasePage } from "@pages/BasePage";

export class CheckoutPage extends BasePage {
  // Locators
  get proceedToCheckoutBtn(): Locator {
    return this.page.locator('button[data-role="proceed-to-checkout"]');
  }
  get email(): Locator {
    return this.page.locator(
      '#customer-email-fieldset input[id="customer-email"]'
    );
  }
  get shippingFirstName(): Locator {
    return this.page.locator('div[name="shippingAddress.firstname"] input');
  }
  get shippingLastName(): Locator {
    return this.page.locator('div[name="shippingAddress.lastname"] input');
  }
  get street(): Locator {
    return this.page.locator('div[name="shippingAddress.street.0"] input');
  }
  get city(): Locator {
    return this.page.locator('div[name="shippingAddress.city"] input');
  }
  get state(): Locator {
    return this.page.locator('div[name="shippingAddress.region_id"] select');
  }
  get postcode(): Locator {
    return this.page.locator('div[name="shippingAddress.postcode"] input');
  }
  get country(): Locator {
    return this.page.locator('div[name="shippingAddress.country_id"] select');
  }
  get telephone(): Locator {
    return this.page.locator('div[name="shippingAddress.telephone"] input');
  }
  get shippingMethods(): Locator {
    return this.page.locator(
      ".shipping-methods, #checkout-shipping-method-load"
    );
  }
  get shippingPrice(): Locator {
    return this.page.locator(
      ".shipping-methods .price, #checkout-shipping-method-load .price"
    );
  }
  get nextButton(): Locator {
    return this.page.locator('button[data-role="opc-continue"]');
  }
  get paymentHeader(): Locator {
    return this.page.locator("text=Payment Method");
  }
  get discountPanelToggle(): Locator {
    return this.page.locator("span#block-discount-heading");
  }
  get discountInput(): Locator {
    return this.page.locator('input[name="discount_code"]');
  }
  get discountButton(): Locator {
    return this.page.locator('button:has-text("Apply Discount")');
  }
  get discountMessage(): Locator {
    return this.page.locator(".message-success");
  }
  get placeOrderButton(): Locator {
    return this.page.locator('button[class*="primary checkout"]');
  }
  get orderSuccessNumber(): Locator {
    return this.page.locator(
      ".checkout-success .order-number, .checkout-success p span"
    );
  }

  constructor(page: Page) {
    super(page);
  }

  async proceedToCheckout(): Promise<void> {
    await expect(this.proceedToCheckoutBtn).toBeVisible();
    await expect(this.proceedToCheckoutBtn).toBeEnabled();
    await Promise.all([
      this.page.waitForURL("**/checkout/**", { timeout: 20000 }),
      this.proceedToCheckoutBtn.click(),
    ]);
  }

  /**
   Fill out checkout form 
   */
  async completeCheckoutForm({
    email = "checkout-user@test.com",
    firstName = "Checkout",
    lastName = "User",
    street = "Automationstraat 1",
    city = "Amsterdam",
    country = "Netherlands",
    region = "Alabama", // default region (may need to match selected country)
    postcode = "1012WX",
    telephone = "31201234567",
  } = {}): Promise<void> {
    await this.email.fill(email);
    await this.shippingFirstName.fill(firstName);
    await this.shippingLastName.fill(lastName);
    await this.street.fill(street);
    await this.city.fill(city);
    await this.country.selectOption({ label: country });
    if (region && (await this.state.isVisible())) {
      await this.state.selectOption({ label: region });
    }
    await this.postcode.fill(postcode);
    await this.telephone.scrollIntoViewIfNeeded();
    await this.telephone.fill(telephone);
  }

  /**
   Navigate to Payment
   */
  async goToPayment() {
    await this.nextButton.click();
    await expect(this.paymentHeader).toBeVisible();
  }
}
