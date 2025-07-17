import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import type { Page, Locator } from "playwright";

export class HeaderPage extends BasePage {
  async selectCategory(page: Page, categoryName: string): Promise<void> {
    const categorySpan: Locator = page.locator(
      `//span[normalize-space(text())="${categoryName}"]`
    );
    await categorySpan.waitFor({ state: "visible", timeout: 5000 });
    await categorySpan.click();
  }

  async clickCategoryButton(page: Page): Promise<void> {
    const categoryButton = page.locator("div.filter-options-title", {
      hasText: "Category",
    });
    await expect(categoryButton).toBeVisible({ timeout: 8000 });
    await categoryButton.scrollIntoViewIfNeeded();
    await categoryButton.waitFor();
    await categoryButton.click();
  }

  async selectSubCategory(page: Page, subCategory: string): Promise<void> {
    const subCategoryLocator = page
      .locator(`a:has-text("${subCategory}")`)
      .last();
    await subCategoryLocator.waitFor({ state: "visible", timeout: 5000 });
    await subCategoryLocator.hover();
    await subCategoryLocator.click();
  }
  async selectFilterOption(page: Page, optionText: string): Promise<void> {
    const filterTitle = page.locator("#narrow-by-list .filter-options-title", {
      hasText: optionText,
    });
    if (!(await page.locator(".filter-options-item.active").isVisible())) {
      await filterTitle.scrollIntoViewIfNeeded();
      await filterTitle.click();
    }
    await page.waitForSelector(
      ".filter-options-item.active .filter-options-content",
      {
        state: "visible",
        timeout: 8000,
      }
    );
    const filterOption = page.locator(
      `.filter-options-item.active a:has-text("${optionText}")`
    );
    await filterOption.waitFor({ state: "visible" });
    await filterOption.click();
  }


  async selectShoppingOption(
    page: Page,
    groupName: string,
    optionText: string
  ): Promise<void> {
    const groupTitles = page.locator(".filter-options-title");
    const groupContents = page.locator(".filter-options-content");
    const count = await groupTitles.count();

    for (let i = 0; i < count; i++) {
      const title = groupTitles.nth(i);
      if (
        (await title.textContent())?.trim().toLowerCase() ===
        groupName.toLowerCase()
      ) {
        if ((await title.getAttribute("aria-expanded")) === "false")
          await title.click();
        const option = groupContents
          .nth(i)
          .locator("a", { hasText: optionText });
        await expect(option).toBeVisible({ timeout: 5000 });
        await option.click();
        return;
      }
    }

    throw new Error(`Filter group "${groupName}" not found`);
  }

  async assertFilterApplied(filterLabel: string, filterValue: string) {
  
    await expect(
      this.page.locator(
        `ol.items li.item:has(span.filter-label:has-text("${filterLabel}")) span.filter-value`
      )
    ).toHaveText(filterValue, { timeout: 10000 });
  }
}
