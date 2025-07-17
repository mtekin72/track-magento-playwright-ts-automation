import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HeaderPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async selectCategory(categoryName: string): Promise<void> {
    const categorySpan: Locator = this.page.locator(
      `//span[normalize-space(text())="${categoryName}"]`
    );
    await categorySpan.waitFor({ state: "visible", timeout: 5000 });
    await categorySpan.click();
  }

  async clickCategoryButton(): Promise<void> {
    const categoryButton = this.page.locator("div.filter-options-title", {
      hasText: "Category",
    });
    await expect(categoryButton).toBeVisible({ timeout: 8000 });
    await categoryButton.scrollIntoViewIfNeeded();
    await categoryButton.waitFor();
    await categoryButton.click();
  }

  async selectSubCategory(subCategory: string): Promise<void> {
    const subCategoryLocator = this.page
      .locator(`a:has-text("${subCategory}")`)
      .last();
    await subCategoryLocator.waitFor({ state: "visible", timeout: 5000 });
    await subCategoryLocator.hover();
    await subCategoryLocator.click();
  }

  async selectFilterOption(optionText: string): Promise<void> {
    const filterTitle = this.page.locator(
      "#narrow-by-list .filter-options-title",
      {
        hasText: optionText,
      }
    );
    if (!(await this.page.locator(".filter-options-item.active").isVisible())) {
      await filterTitle.scrollIntoViewIfNeeded();
      await filterTitle.click();
    }
    await this.page.waitForSelector(
      ".filter-options-item.active .filter-options-content",
      {
        state: "visible",
        timeout: 8000,
      }
    );
    const filterOption = this.page.locator(
      `.filter-options-item.active a:has-text("${optionText}")`
    );
    await filterOption.waitFor({ state: "visible" });
    await filterOption.click();
  }

  async selectShoppingOption(
    groupName: string,
    optionText: string
  ): Promise<void> {
    const groupTitles = this.page.locator(".filter-options-title");
    const groupContents = this.page.locator(".filter-options-content");
    const count = await groupTitles.count();

    for (let i = 0; i < count; i++) {
      const title = groupTitles.nth(i);
      if (
        (await title.textContent())?.trim().toLowerCase() ===
        groupName.toLowerCase()
      ) {
        if ((await title.getAttribute("aria-expanded")) === "false") {
          await title.click();
        }
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

  async assertFilterApplied(
    filterLabel: string,
    filterValue: string
  ): Promise<void> {
    await expect(
      this.page.locator(
        `ol.items li.item:has(span.filter-label:has-text("${filterLabel}")) span.filter-value`
      )
    ).toHaveText(filterValue, { timeout: 10000 });
  }
}

