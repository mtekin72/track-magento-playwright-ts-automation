import { test, expect, Page } from "@playwright/test";
import {
  HomePage,
  ProductListingPage,
  ProductDetailsPage,
  CartPage,
  CheckoutPage,
  HeaderPage,
} from "../pages";
import { testData } from "../helpers/testData";
import { closeAdIfPresent } from "../helpers/adBlockUtils";
import { AssertionHelper } from "../helpers/assertionHelper";

let homepage: HomePage;
let headerPage: HeaderPage;
let assertionHelper: AssertionHelper;
let productDetailsPage: ProductDetailsPage;
let productListingPage: ProductListingPage;
let cartPage: CartPage;
let checkoutPage: CheckoutPage;

const handleConsent = async (page: Page) => {
  const consentBtn = page.getByRole("button", { name: "Consent" });
  if (await consentBtn.isVisible()) {
    await consentBtn.click();
  }
};

test.beforeEach(async ({ page }) => {
  homepage = new HomePage(page);
  headerPage = new HeaderPage(page);
  assertionHelper = new AssertionHelper(page);
  productDetailsPage = new ProductDetailsPage(page);
  productListingPage = new ProductListingPage(page);
  cartPage = new CartPage(page);
  checkoutPage = new CheckoutPage(page);
});

test("should navigate to Men's Jackets and add product with XS size and Blue color in cart", async ({
  page,
}) => {
  const {
    menuPath: [category, subCategory, productCategory],
    quantity,
    size,
    color,
    product,
  } = testData.sampleTests.scenario1;

  await homepage.goto("/");
  await handleConsent(page);
  await headerPage.selectCategory(category);
  await assertionHelper.assertCategoryInURL(category);
  await headerPage.selectSubCategory(subCategory);
  await closeAdIfPresent(page);
  await headerPage.clickCategoryButton();
  await closeAdIfPresent(page);
  await headerPage.selectFilterOption(productCategory.toLowerCase());
  await closeAdIfPresent(page);
  await assertionHelper.assertSelectedFilter(productCategory);

  await productDetailsPage.selectSize(size);
  await closeAdIfPresent(page);
  await productDetailsPage.selectColor(color);
  await closeAdIfPresent(page);
  await assertionHelper.assertSelectedColor(color);
  await assertionHelper.assertSizeSelection(size, "rgb(255, 85, 1)");

  await productDetailsPage.addToCart();
  await closeAdIfPresent(page);
  await assertionHelper.assertProductAddedToCart(product);
  await cartPage.goToCart();
  await closeAdIfPresent(page);

  await expect(page.locator(".cart.item .item-options")).toContainText(size);
  await expect(page.locator(".cart.item .product-item-details")).toContainText(
    color
  );
  await expect(page.locator(".cart.item .input-text.qty")).toHaveValue(
    quantity.toString()
  );
  await expect(page.locator(".cart.item .product-item-details")).toContainText(
    product
  );

  await assertionHelper.assertColorMatchesImage();
});

test("should navigate to Women's Jackets and add 2 units with XS size and Blue color in cart", async ({
  page,
}) => {
  const {
    menuPath: [category, subCategory, productCategory],
    quantity,
    size,
    color,
    product,
  } = testData.sampleTests.scenario2;

  await homepage.goto("/");
  await handleConsent(page);
  await headerPage.selectCategory(category);
  await closeAdIfPresent(page);
  await assertionHelper.assertCategoryInURL(category);
  await headerPage.selectSubCategory(subCategory);
  await closeAdIfPresent(page);
  await headerPage.clickCategoryButton();
  await closeAdIfPresent(page);
  await headerPage.selectFilterOption(productCategory);
  await closeAdIfPresent(page);

  await productDetailsPage.selectSize(size);
  await closeAdIfPresent(page);
  await productDetailsPage.selectColor(color);
  await closeAdIfPresent(page);
  await assertionHelper.assertSelectedColor(color);
  await assertionHelper.assertSizeSelection(size, "rgb(255, 85, 1)");

  await productDetailsPage.addToCart();
  await closeAdIfPresent(page);
  await assertionHelper.assertProductAddedToCart(product);
  await cartPage.goToCart();
  await closeAdIfPresent(page);
  await cartPage.setProductQuantity(quantity);

  await expect(page.locator(".cart.item .item-options")).toContainText(size);
  await expect(page.locator(".cart.item .product-item-details")).toContainText(
    color
  );
  await expect(page.locator(".cart.item .input-text.qty")).toHaveValue(
    quantity.toString()
  );
  await expect(page.locator(".cart.item .product-item-details")).toContainText(
    product
  );

  await assertionHelper.assertColorMatchesImage();
});

test("should navigate to Gear → Bags and filter products by Activity = Yoga", async ({
  page,
}) => {
  const {
    menuPath: [category, subCategory],
    filter: { option, activity },
  } = testData.sampleTests.scenario3;

  await homepage.goto("/");
  await handleConsent(page);
  await headerPage.selectCategory(category);
  await closeAdIfPresent(page);
  await assertionHelper.assertCategoryInURL(category);
  await headerPage.selectSubCategory(subCategory);
  await closeAdIfPresent(page);
  await headerPage.selectShoppingOption(option, activity);
  await closeAdIfPresent(page);
  await headerPage.assertFilterApplied(option, activity);
});

test("should verify different random products are selected on multiple runs", async ({
  page,
}) => {
  const {
    menuPath: [category, subCategory],
  } = testData.sampleTests.scenario3;

  await homepage.goto("/");
  await handleConsent(page);
  await headerPage.selectCategory(category);
  await assertionHelper.assertCategoryInURL(category);
  await headerPage.selectSubCategory(subCategory);
  await productListingPage.selectRandomProduct();
  await productDetailsPage.addToCart();
  await cartPage.assertAddToCartSuccess();
});

test('should verify checkout applies "20poff" discount and calculates Netherlands shipping correctly', async ({
  page,
}) => {
  const {
    menuPath: [category, subCategory, productCategory],
    quantity,
    size,
    color,
    discountCode,
  } = testData.sampleTests.scenario4;
  const shippingCountry = testData.sampleTests.shipping.country;

  await homepage.goto("/");
  await handleConsent(page);
  await headerPage.selectCategory(category);
  await closeAdIfPresent(page);
  await headerPage.selectSubCategory(subCategory);
  await closeAdIfPresent(page);
  await headerPage.clickCategoryButton();
  await closeAdIfPresent(page);
  await headerPage.selectFilterOption(productCategory);
  await closeAdIfPresent(page);
  await productDetailsPage.selectSize(size);
  await closeAdIfPresent(page);
  await productDetailsPage.selectColor(color);
  await closeAdIfPresent(page);
  await productDetailsPage.addToCart();
  await closeAdIfPresent(page);
  await cartPage.goToCart();
  await closeAdIfPresent(page);
  await cartPage.setProductQuantity(quantity);
  await closeAdIfPresent(page);
  await checkoutPage.proceedToCheckout();
  await closeAdIfPresent(page);
  await checkoutPage.completeCheckoutForm({});
  await closeAdIfPresent(page);
  await expect(
    page.locator('input[type="radio"][checked], .selected.shipping-method')
  ).toBeVisible();
  await checkoutPage.nextButton.click();
  await closeAdIfPresent(page);
  await checkoutPage.discountPanelToggle.click();
  await closeAdIfPresent(page);
  await checkoutPage.discountInput.fill(discountCode);
  await closeAdIfPresent(page);
  await checkoutPage.discountButton.click();
  await closeAdIfPresent(page);
  await expect(checkoutPage.discountMessage).toContainText(
    "Your coupon was successfully applied."
  );
  await checkoutPage.placeOrderButton.click();
  await closeAdIfPresent(page);
  await expect(
    page.locator('tr:has(th:has-text("Discount")) th')
  ).toContainText("20%");
  await expect(page.locator(".shipping-information-content").first()).toContainText(
    shippingCountry
  );
  await expect(page.locator("span.price", { hasText: "-$7.84" })).toHaveText(
    "-$7.84"
  );
  await expect(page.locator("span.price", { hasText: "$36.36" })).toBeVisible();
  await expect(
    page.locator('span.base[data-ui-id="page-title-wrapper"]')
  ).toHaveText("Thank you for your purchase!");
});

test("should verify that quantity is correctly applied", async ({ page }) => {
  const {
    menuPath: [category, subCategory, productCategory],
    quantity,
    size,
    color,
  } = testData.sampleTests.scenario5;

  await homepage.goto("/");
  await handleConsent(page);
  await headerPage.selectCategory(category);
  await closeAdIfPresent(page);
  await headerPage.selectSubCategory(subCategory);
  await closeAdIfPresent(page);
  await headerPage.clickCategoryButton();
  await closeAdIfPresent(page);
  await headerPage.selectFilterOption(productCategory);
  await closeAdIfPresent(page);
  await productDetailsPage.selectSize(size);
  await closeAdIfPresent(page);
  await productDetailsPage.selectColor(color);
  await closeAdIfPresent(page);
  await productDetailsPage.addToCart();
  await closeAdIfPresent(page);
  await cartPage.goToCart();
  await closeAdIfPresent(page);
  await expect(page.getByRole("spinbutton", { name: "Qty" })).toHaveValue(
    quantity.toString()
  );
});
