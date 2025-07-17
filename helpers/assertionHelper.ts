import { expect, Page } from "@playwright/test";

export class AssertionHelper {
  constructor(private readonly page: Page) {}

  async assertCategoryInURL(category: string): Promise<void> {
    const url = this.page.url().toLowerCase();
    expect(url).toContain(`/${category.toLowerCase()}`);
  }

  async assertSelectedFilter(expectedOption: string): Promise<void> {
    await expect(this.page.locator("span.filter-value")).toHaveText(
      expectedOption
    );
  }

  async assertSizeSelection(
    size: string,
    expectedColor: string
  ): Promise<void> {
    const element = this.page.locator(
      `div.swatch-option.text.selected[aria-label="${size}"]`
    );
    const outlineColor = await element.evaluate(
      (el) => getComputedStyle(el).outlineColor
    );
    expect(outlineColor).toBe(expectedColor);
  }

  async assertSelectedColor(color: string): Promise<void> {
    const colorOption = this.page.locator(
      `div.swatch-option.color.selected[aria-label="${color}"]`
    );
    await expect(colorOption).toBeVisible();
  }

  async assertProductAddedToCart(productName: string): Promise<void> {
    const messageLocator = this.page.locator(
      'div[data-ui-id="message-success"]'
    );
    await expect(messageLocator).toContainText(
      `You added ${productName} to your shopping cart`
    );
  }

  async assertColorMatchesImage(): Promise<void> {
    const colorLocator = this.page.locator(
      'dl.item-options dt:has-text("Color") + dd'
    );
    const selectedColorText = await colorLocator.textContent();
    const selectedColor = selectedColorText?.trim().toLowerCase();
    if (!selectedColor) {
      throw new Error("Selected color not found on the page");
    }
    const imageLocator = this.page.locator("img.product-image-photo").first();
    const imageSrc = await imageLocator.getAttribute("src");
    if (!imageSrc) {
      throw new Error("Product image not found on the page");
    }
    expect(imageSrc.toLowerCase()).toContain(selectedColor);
  }
}
