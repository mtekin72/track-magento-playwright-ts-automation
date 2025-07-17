import { expect, Locator, Page } from '@playwright/test';

export class AssertionHelper {
 
  async assertCategoryInURL(page: Page, category: string): Promise<void> {
    const url = page.url().toLowerCase();
    expect(url).toContain(`/${category.toLowerCase()}`);
  }
  
  async  assertSelectedFilter(page: Page, expectedOption: string): Promise<void> {
    await expect(page.locator('span.filter-value')).toHaveText(expectedOption);
  }
  
  async  assertSizeSelection(page: Page, size: string, expectedColor: string): Promise<void> {
    const element = page.locator(`div.swatch-option.text.selected[aria-label="${size}"]`);
    const outlineColor = await element.evaluate(el => getComputedStyle(el).outlineColor);
    expect(outlineColor).toBe(expectedColor);
  }

  async  assertSelectedColor(page: Page, color: string): Promise<void> {
    const colorOption = page.locator(`div.swatch-option.color.selected[aria-label="${color}"]`);
    await expect(colorOption).toBeVisible();
  }
  
  async  assertProductAddedToCart(
    page: Page,
    productName: string
  ): Promise<void> {
    const messageLocator = page.locator('div[data-ui-id="message-success"]');
    await expect(messageLocator).toContainText(`You added ${productName} to your shopping cart`);
  }

async assertColorMatchesImage(page: Page): Promise<void> {
    const colorLocator = page.locator('dl.item-options dt:has-text("Color") + dd');
    const selectedColorText = await colorLocator.textContent();
    const selectedColor = selectedColorText?.trim().toLowerCase();
    if (!selectedColor) {
      throw new Error('Selected color not found on the page');
    }
    const imageLocator = page.locator('img.product-image-photo').first();
    const imageSrc = await imageLocator.getAttribute('src');
    if (!imageSrc) {
      throw new Error('Product image not found on the page');
    }
    expect(imageSrc.toLowerCase()).toContain(selectedColor);
  }
}
