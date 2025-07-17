import { expect, Page } from "@playwright/test";
import { BasePage } from "@pages/BasePage";

export class CheckoutPage extends BasePage {
  readonly proceedToCheckoutBtn = this.page.locator(
    'button[data-role="proceed-to-checkout"]'
  );
  readonly email = this.page.locator(
    '#customer-email-fieldset input[id="customer-email"]'
  );
  readonly shippingFirstName = this.page.locator(
    'div[name="shippingAddress.firstname"] input'
  );
  readonly shippingLastName = this.page.locator(
    'div[name="shippingAddress.lastname"] input'
  );
  readonly street = this.page.locator(
    'div[name="shippingAddress.street.0"] input'
  );
  readonly city = this.page.locator('div[name="shippingAddress.city"] input');
  readonly state = this.page.locator(
    'div[name="shippingAddress.region_id"] select'
  );
  readonly postcode = this.page.locator(
    'div[name="shippingAddress.postcode"] input'
  );
  readonly country = this.page.locator(
    'div[name="shippingAddress.country_id"] select'
  );
  readonly telephone = this.page.locator(
    'div[name="shippingAddress.telephone"] input'
  );
  readonly shippingMethods = this.page.locator(
    ".shipping-methods, #checkout-shipping-method-load"
  );
  readonly shippingPrice = this.page.locator(
    ".shipping-methods .price, #checkout-shipping-method-load .price"
  );
  readonly nextButton = this.page.locator('button[data-role="opc-continue"]');

  readonly paymentHeader = this.page.locator("text=Payment Method");
  readonly discountPanelToggle = this.page.locator(
    "span#block-discount-heading"
  );
  readonly discountInput = this.page.locator('input[name="discount_code"]');
  readonly discountButton = this.page.locator(
    'button:has-text("Apply Discount")'
  );
  readonly discountMessage = this.page.locator(".message-success");
  readonly placeOrderButton = this.page.locator(
    'button[class*="primary checkout"]'
  );

  readonly orderSuccessNumber = this.page.locator(
    ".checkout-success .order-number, .checkout-success p span"
  );

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

  async completeCheckoutForm({
    email = "checkout-user@test.com",
    firstName = "Checkout",
    lastName = "User",
    street = "Automationstraat 1",
    city = "Amsterdam",
    country = "Netherlands",
    region = "Alabama", 
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


  async goToPayment() {
    await this.nextButton.click();
    await expect(this.paymentHeader).toBeVisible();
  }

}