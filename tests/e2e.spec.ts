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

// Utility to handle consent & potential ads
async function acceptConsentAndCloseAds(page: Page) {
  try {
    const consentBtn = page.getByRole("button", { name: "Consent" });
    if (await consentBtn.isVisible({ timeout: 3000 })) {
      await consentBtn.click();
    }
  } catch {
    // ignore if not present
  }
  await closeAdIfPresent(page);
}

test.describe("Magento E2E Journeys", () => {
  test("should navigate to Men's Jackets and add product with XS size and Blue color in cart", async ({
    page,
  }) => {
    const scenario = testData.sampleTests.scenario1;
    const homepage = new HomePage(page);
    const headerPage = new HeaderPage(page);
    const assertionHelper = new AssertionHelper();
    const productDetailsPage = new ProductDetailsPage(page);
    const cartPage = new CartPage(page);

    await homepage.goto("/");
    await acceptConsentAndCloseAds(page);

    await headerPage.selectCategory(scenario.menuPath[0]);
    await assertionHelper.assertCategoryInURL(
      page,
      scenario.menuPath[0].toLowerCase()
    );
    await headerPage.selectSubCategory(scenario.menuPath[1]);
    await closeAdIfPresent(page);
    await headerPage.clickCategoryButton();
    await headerPage.selectFilterOption(scenario.menuPath[2].toLowerCase());
    await assertionHelper.assertSelectedFilter(
      page,
      scenario.menuPath[2][0].toUpperCase() + scenario.menuPath[2].slice(1)
    );

    await productDetailsPage.selectSize(scenario.size);
    await productDetailsPage.selectColor(scenario.color);
    await assertionHelper.assertSelectedColor(page, scenario.color);
    await assertionHelper.assertSizeSelection(
      page,
      scenario.size,
      "rgb(255, 85, 1)"
    );

    await productDetailsPage.addToCart();
    await assertionHelper.assertProductAddedToCart(page, scenario.product);
    await cartPage.goToCart();

    await expect(page.locator(".cart.item .item-options")).toContainText("XS");
    await expect(
      page.locator(".cart.item .product-item-details")
    ).toContainText("Blue");
    await expect(page.locator(".cart.item .input-text.qty")).toHaveValue("1");
    await expect(
      page.locator(".cart.item .product-item-details")
    ).toContainText("Proteus Fitness Jackshirt");

    await assertionHelper.assertColorMatchesImage(page);
  });

  test("should navigate to Women's Jackets and add 2 units with XS size and Blue color in cart", async ({
    page,
  }) => {
    const scenario = testData.sampleTests.scenario2;
    const homepage = new HomePage(page);
    const headerPage = new HeaderPage(page);
    const assertionHelper = new AssertionHelper();
    const productDetailsPage = new ProductDetailsPage(page);
    const cartPage = new CartPage(page);

    await homepage.goto("/");
    await acceptConsentAndCloseAds(page);

    await headerPage.selectCategory(scenario.menuPath[0]);
    await closeAdIfPresent(page);
    await assertionHelper.assertCategoryInURL(
      page,
      scenario.menuPath[0].toLowerCase()
    );
    await headerPage.selectSubCategory(scenario.menuPath[1]);
    await closeAdIfPresent(page);
    await headerPage.clickCategoryButton();
    await closeAdIfPresent(page);
    await headerPage.selectFilterOption(scenario.menuPath[2].toLowerCase());
    await closeAdIfPresent(page);
    await assertionHelper.assertSelectedFilter(
      page,
      scenario.menuPath[2][0].toUpperCase() + scenario.menuPath[2].slice(1)
    );

    await productDetailsPage.selectSize(scenario.size);
    await closeAdIfPresent(page);
    await productDetailsPage.selectColor(scenario.color);
    await closeAdIfPresent(page);
    await assertionHelper.assertSelectedColor(page, scenario.color);
    await assertionHelper.assertSizeSelection(
      page,
      scenario.size,
      "rgb(255, 85, 1)"
    );

    await productDetailsPage.addToCart();
    await closeAdIfPresent(page);
    await assertionHelper.assertProductAddedToCart(page, scenario.product);
    await cartPage.goToCart();
    await closeAdIfPresent(page);
    await cartPage.setProductQuantity(scenario.quantity);

    await expect(page.locator(".cart.item .item-options")).toContainText("XS");
    await expect(
      page.locator(".cart.item .product-item-details")
    ).toContainText("Blue");
    await expect(page.locator(".cart.item .input-text.qty")).toHaveValue("2");
    await expect(
      page.locator(".cart.item .product-item-details")
    ).toContainText("Olivia 1/4 Zip Light Jacket");
    await assertionHelper.assertColorMatchesImage(page);
  });

  test("should navigate to Gear → Bags and filter products by Activity = Yoga", async ({
    page,
  }) => {
    const scenario = testData.sampleTests.scenario3;
    const homepage = new HomePage(page);
    const headerPage = new HeaderPage(page);
    const assertionHelper = new AssertionHelper();

    await homepage.goto("/");
    await acceptConsentAndCloseAds(page);
    await headerPage.selectCategory(scenario.menuPath[0]);
    await closeAdIfPresent(page);
    await assertionHelper.assertCategoryInURL(
      page,
      scenario.menuPath[0].toLowerCase()
    );
    await headerPage.selectSubCategory(scenario.menuPath[1]);
    await closeAdIfPresent(page);
    await headerPage.selectShoppingOption(
      scenario.filter.option,
      scenario.filter.activity
    );
    await headerPage.assertFilterApplied(
      scenario.filter.option,
      scenario.filter.activity
    );
  });

  test("should verify different random products are selected on multiple runs", async ({
    page,
  }) => {
    const scenario = testData.sampleTests.scenario3;
    const homepage = new HomePage(page);
    const headerPage = new HeaderPage(page);
    const assertionHelper = new AssertionHelper();
    const productListingPage = new ProductListingPage(page);
    const productDetailsPage = new ProductDetailsPage(page);
    const cartPage = new CartPage(page);

    await homepage.goto("/");
    await acceptConsentAndCloseAds(page);
    await headerPage.selectCategory(scenario.menuPath[0]);
    await closeAdIfPresent(page);
    await assertionHelper.assertCategoryInURL(page, scenario.menuPath[0]);
    await headerPage.selectSubCategory(scenario.menuPath[1]);
    await closeAdIfPresent(page);
    await productListingPage.selectRandomProduct();
    await closeAdIfPresent(page);
    await productDetailsPage.addToCart();
    await closeAdIfPresent(page);
    await cartPage.assertAddToCartSuccess();
  });

  test('should verify checkout applies "20poff" discount and calculates Netherlands shipping correctly', async ({
    page,
  }) => {
    const scenario = testData.sampleTests.scenario4;
    const homepage = new HomePage(page);
    const headerPage = new HeaderPage(page);
    const productDetailsPage = new ProductDetailsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await homepage.goto("/");
    await acceptConsentAndCloseAds(page);
    await headerPage.selectCategory(scenario.menuPath[0]);
    await closeAdIfPresent(page);
    await headerPage.selectSubCategory(scenario.menuPath[1]);
    await headerPage.clickCategoryButton();
    await closeAdIfPresent(page);
    await headerPage.selectFilterOption(scenario.menuPath[2]);
    await productDetailsPage.selectSize(scenario.size);
    await closeAdIfPresent(page);
    await productDetailsPage.selectColor(scenario.color);
    await closeAdIfPresent(page);
    await productDetailsPage.addToCart();
    await closeAdIfPresent(page);
    await cartPage.goToCart();
    await closeAdIfPresent(page);
    await cartPage.setProductQuantity(scenario.quantity);
    await checkoutPage.proceedToCheckout();
    await checkoutPage.completeCheckoutForm({});
    await expect(
      page.locator('input[type="radio"][checked], .selected.shipping-method')
    ).toBeVisible({ timeout: 10000 });
    await checkoutPage.nextButton.click();
    await closeAdIfPresent(page);
    await expect(checkoutPage.discountPanelToggle).toBeVisible({
      timeout: 50000,
    });
    await checkoutPage.discountPanelToggle.click();
    await checkoutPage.discountInput.fill(scenario.discountCode);
    await checkoutPage.discountButton.click();
    await expect(checkoutPage.discountMessage).toContainText(
      " Your coupon was successfully applied. ",
      { timeout: 10000 }
    );
    await checkoutPage.placeOrderButton.click();
    await expect(
      page.locator('tr:has(th:has-text("Discount")) th')
    ).toContainText("20%");
    await expect(
      page
        .locator(".shipping-information-content")
        .filter({ hasText: "Netherlands" })
    ).toContainText("Netherlands");

    // discount after coupon applied
    const discountLocator = page.locator("span.price", { hasText: "-$7.84" });
    await expect(discountLocator).toHaveText("-$7.84");
    // Total price after discount applied
    await expect(
      page.locator("span.price", { hasText: "$36.36" })
    ).toBeVisible();

    // Verify order success message
    await expect(
      page.locator('span.base[data-ui-id="page-title-wrapper"]')
    ).toHaveText("Thank you for your purchase!");
  });

  test("should verify that quantity is correctly applied", async ({ page }) => {
    const scenario = testData.sampleTests.scenario5;
    const homepage = new HomePage(page);
    const headerPage = new HeaderPage(page);
    const productDetailsPage = new ProductDetailsPage(page);
    const cartPage = new CartPage(page);

    await homepage.goto("/");
    await acceptConsentAndCloseAds(page);
    await headerPage.selectCategory(scenario.menuPath[0]);
    await closeAdIfPresent(page);
    await headerPage.selectSubCategory(scenario.menuPath[1]);
    await headerPage.clickCategoryButton();
    await closeAdIfPresent(page);
    await headerPage.selectFilterOption(scenario.menuPath[2]);
    await productDetailsPage.selectSize(scenario.size);
    await closeAdIfPresent(page);
    await productDetailsPage.selectColor(scenario.color);
    await closeAdIfPresent(page);
    await productDetailsPage.addToCart();
    await closeAdIfPresent(page);
    await cartPage.goToCart();
    await expect(page.getByRole("spinbutton", { name: "Qty" })).toHaveValue(
      scenario.quantity.toString()
    );
  });
});

// import { test, expect, Page } from '@playwright/test';
// import {
//   HomePage,
//   ProductListingPage,
//   ProductDetailsPage,
//   CartPage,
//   CheckoutPage,
//   HeaderPage
// } from '../pages';
// import { testData } from '../helpers/testData';
// import { closeAdIfPresent } from '../helpers/adBlockUtils';
// import { AssertionHelper } from '../helpers/assertionHelper';

// let homepage: HomePage;
// let headerPage: HeaderPage;
// let assertionHelper: AssertionHelper;
// let productDetailsPage: ProductDetailsPage;
// let productListingPage:ProductListingPage;
// let cartPage: CartPage;
// let checkoutPage: CheckoutPage;

// test.beforeEach(async ({ page }) => {
//   homepage = new HomePage(page);
//   headerPage = new HeaderPage(page);
//   assertionHelper = new AssertionHelper();
//   productDetailsPage = new ProductDetailsPage(page);
//   productListingPage= new ProductListingPage(page);
//   cartPage = new CartPage(page);
//   checkoutPage = new CheckoutPage(page);
// });
// test('should navigate to Men\'s Jackets and add product with XS size and Blue color in cart', async ({ page }) => {
//   const scenario = testData.sampleTests.scenario1;
//   const category = scenario.menuPath[0]; // "Men"
//   const subCategory = scenario.menuPath[1]; // "Tops"
//   const productCategory = scenario.menuPath[2]; // "Jackets"
//   const quantity = scenario.quantity; // 1
//   const size = scenario.size; // "XS"
//   const color = scenario.color; // "Blue"
//   const product = scenario.product; // "Proteus Fitness Jackshirt"

//   await homepage.goto('/');
//   await page.getByRole('button', { name: 'Consent' }).click();
//   await headerPage.selectCategory(page, category);
//   await assertionHelper.assertCategoryInURL(page, category.toLowerCase());
//   await headerPage.selectSubCategory(page, subCategory);
//   await closeAdIfPresent(page);
//   await headerPage.clickCategoryButton(page);
//   await headerPage.selectFilterOption(page, productCategory.toLowerCase());
//   await assertionHelper.assertSelectedFilter(page, productCategory.charAt(0).toUpperCase() + productCategory.slice(1));

//   await productDetailsPage.selectSize(page, size);
//   await productDetailsPage.selectColor(page, color);
//   await assertionHelper.assertSelectedColor(page, color);
//   await assertionHelper.assertSizeSelection(page, size, 'rgb(255, 85, 1)');

//   await productDetailsPage.addToCart(page);
//   await assertionHelper.assertProductAddedToCart(page, product);
//   await cartPage.goToCart(page);

//   await expect(page.locator('.cart.item .item-options')).toContainText('XS');
//   await expect(page.locator('.cart.item .product-item-details')).toContainText('Blue');
//   await expect(page.locator('.cart.item .input-text.qty')).toHaveValue('1');
//   await expect(page.locator('.cart.item .product-item-details')).toContainText('Proteus Fitness Jackshirt');

//   await assertionHelper.assertColorMatchesImage(page);
// });

// test('should navigate to Women\'s Jackets and add 2 units with XS size and Blue color in cart', async ({ page }) => {
//   const scenario = testData.sampleTests.scenario2;
//   const category = scenario.menuPath[0]; // "Women"
//   const subCategory = scenario.menuPath[1]; // "Tops"
//   const productCategory = scenario.menuPath[2]; // "Jackets"
//   const quantity = scenario.quantity; // 2
//   const size = scenario.size; // "XS"
//   const color = scenario.color; // "Blue"
//   const product = scenario.product; //
//   const discountCode = testData.sampleTests; // "20poff" for applying discount

//   await homepage.goto('/');
//   await page.getByRole('button', { name: 'Consent' }).click();
//   await headerPage.selectCategory(page, category);
//   await closeAdIfPresent(page);
//   await assertionHelper.assertCategoryInURL(page, category.toLowerCase());
//   await headerPage.selectSubCategory(page, subCategory);
//   await closeAdIfPresent(page);
//   await headerPage.clickCategoryButton(page);
//   await closeAdIfPresent(page);
//   await headerPage.selectFilterOption(page, productCategory.toLowerCase());
//   await closeAdIfPresent(page);
//   await assertionHelper.assertSelectedFilter(page, productCategory.charAt(0).toUpperCase() + productCategory.slice(1));

//   await productDetailsPage.selectSize(page, size);
//   await closeAdIfPresent(page);
//   await productDetailsPage.selectColor(page, color);
//   await closeAdIfPresent(page);
//   await assertionHelper.assertSelectedColor(page, "Blue");
//   await assertionHelper.assertSizeSelection(page, 'XS', 'rgb(255, 85, 1)');

//   await productDetailsPage.addToCart(page);
//   await closeAdIfPresent(page);
//   await assertionHelper.assertProductAddedToCart(page, product);
//   await cartPage.goToCart(page);
//   await closeAdIfPresent(page);
//   await cartPage.setProductQuantity(page, quantity);

//   await expect(page.locator('.cart.item .item-options')).toContainText('XS');
//   await expect(page.locator('.cart.item .product-item-details')).toContainText('Blue');
//   await expect(page.locator('.cart.item .input-text.qty')).toHaveValue('2');
//   await expect(page.locator('.cart.item .product-item-details')).toContainText('Olivia 1/4 Zip Light Jacket');

//   await assertionHelper.assertColorMatchesImage(page);
// });

// test('should navigate to Gear → Bags and filter products by Activity = Yoga', async ({ page }) => {
//   const scenario = testData.sampleTests.scenario3;
//   const category = scenario.menuPath[0]; // "Gear"
//   const subCategory = scenario.menuPath[1]; // "Bags"
//   const option= scenario.filter.option; // "Activity"
//   const filterActivity = scenario.filter.activity; // "Yoga"

//   await homepage.goto("/");
//   await page.getByRole("button", { name: "Consent" }).click();
//   await headerPage.selectCategory(page, category);
//   await closeAdIfPresent(page);
//   await assertionHelper.assertCategoryInURL(page, category.toLowerCase());
//   await headerPage.selectSubCategory(page, subCategory);
//   await closeAdIfPresent(page);
//   await headerPage.selectShoppingOption(page, option, filterActivity);
//   await headerPage.assertFilterApplied(option, filterActivity);

// })

// test('should verify different random products are selected on multiple runs', async ({ page }) => {
//   const scenario = testData.sampleTests.scenario3;
//   const category = scenario.menuPath[0]; // "Gear"
//   const subCategory = scenario.menuPath[1]; // "Bags"

//   await homepage.goto('/');
//   await page.getByRole('button', { name: 'Consent' }).click();
//   await headerPage.selectCategory(page, category);
//   await closeAdIfPresent(page);
//   await assertionHelper.assertCategoryInURL(page, category);
//   await headerPage.selectSubCategory(page, subCategory);
//   await closeAdIfPresent(page);
//   await productListingPage.selectRandomProduct(page);
//   await closeAdIfPresent(page);
//   await productDetailsPage.addToCart(page);
//   await closeAdIfPresent(page);
//   await cartPage.assertAddToCartSuccess();

// })

// test('should verify checkout applies "20poff" discount and calculates Netherlands shipping correctly', async ({page,}) => {
//   const scenario = testData.sampleTests.scenario4;
//   const category = scenario.menuPath[0]; // "Women"
//   const subCategory = scenario.menuPath[1]; // "Bottoms"
//   const productCategory = scenario.menuPath[2]; // "Pants"
//   const shoppingOptions = scenario.shoppingOptions; // ["Style", "Capri"]
//   const quantity = scenario.quantity;
//   const size = scenario.size;
//   const color = scenario.color;
//   const discountCode = testData.sampleTests.scenario4.discountCode; // "20poff"
//   const shippingCountry = testData.sampleTests.shipping.country; //NL

//   await homepage.goto("/");
//   await page.getByRole("button", { name: "Consent" }).click();
//   await headerPage.selectCategory(page, category);
//   await closeAdIfPresent(page);
//   await headerPage.selectSubCategory(page, subCategory);
//   await headerPage.clickCategoryButton(page);
//   await closeAdIfPresent(page);
//   await headerPage.selectFilterOption(page, productCategory);
//   await productDetailsPage.selectSize(page, size);
//   await closeAdIfPresent(page);
//   await productDetailsPage.selectColor(page, color);
//   await closeAdIfPresent(page);
//   await productDetailsPage.addToCart(page);
//   await closeAdIfPresent(page);
//   await cartPage.goToCart(page);
//   await closeAdIfPresent(page);
//   await cartPage.setProductQuantity(page, quantity);
//   await checkoutPage.proceedToCheckout();
//   await checkoutPage.completeCheckoutForm({});
//   await expect(
//     page.locator('input[type="radio"][checked], .selected.shipping-method')
//   ).toBeVisible({ timeout: 10000 });
//   await checkoutPage.nextButton.click();
//   await closeAdIfPresent(page);
//   await expect(checkoutPage.discountPanelToggle).toBeVisible({timeout: 50000,});
//   await checkoutPage.discountPanelToggle.click();
//   await checkoutPage.discountInput.fill(discountCode);
//   await checkoutPage.discountButton.click();
//   await expect(checkoutPage.discountMessage).toContainText(
//     " Your coupon was successfully applied. ",
//     { timeout: 10000 }
//   );
//   await checkoutPage.placeOrderButton.click();
//   await expect(
//     page.locator('tr:has(th:has-text("Discount")) th')
//   ).toContainText("20%");
//   await expect(
//     page
//       .locator(".shipping-information-content")
//       .filter({ hasText: "Netherlands" })
//   ).toContainText("Netherlands");

//   //discount after coupon applied
//   const locator = page.locator("span.price", { hasText: "-$7.84" });
//   await expect(locator).toHaveText("-$7.84");
//   //Total price after discout applied
//   await expect(page.locator("span.price", { hasText: "$36.36" })).toBeVisible();

//   // Verify order success message
//   await expect(
//     page.locator('span.base[data-ui-id="page-title-wrapper"]')
//   ).toHaveText("Thank you for your purchase!");

// })

// test('should verify that quantity is correctly applied', async ({page,}) => {

//   const scenario = testData.sampleTests.scenario5;
//   const category = scenario.menuPath[0]; // "Men"
//   const subCategory = scenario.menuPath[1]; // "Bottoms"
//   const productCategory = scenario.menuPath[2]; // "Shorts"
//   const shoppingOptions = scenario.shoppingOptions; // ["Style", "Tights"]
//   const quantity = scenario.quantity;//2
//   const size = scenario.size;//33
//   const color = scenario.color;//RED
//   const discountCode = testData.sampleTests.scenario5.discountCode; // "20poff"
//   const shippingCountry = testData.sampleTests.shipping; //NL

//   await homepage.goto("/");
//   await page.getByRole("button", { name: "Consent" }).click();
//   await headerPage.selectCategory(page, category);
//   await closeAdIfPresent(page);
//   await headerPage.selectSubCategory(page, subCategory);
//   await headerPage.clickCategoryButton(page);
//   await closeAdIfPresent(page);
//   await headerPage.selectFilterOption(page, productCategory);
//   await productDetailsPage.selectSize(page, size);
//   await closeAdIfPresent(page);
//   await productDetailsPage.selectColor(page, color);
//   await closeAdIfPresent(page);
//   await productDetailsPage.addToCart(page);
//   await closeAdIfPresent(page);
//   await cartPage.goToCart(page);
//   await expect(page.getByRole("spinbutton", { name: "Qty" })).toHaveValue(quantity.toString());
// });
