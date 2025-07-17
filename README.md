# Playwright/TypeScript Automation for Magento Practice Site

This repository contains end-to-end (E2E) tests for UI  functionalities using [Playwright](https://playwright.dev/). The project is structured to test UI application [Magento](https://magento.softwaretestingboard.com/), covering essential shopping and checkout flows, focusing on realistic and flexible product selection, attributes, filtering, and checkout.

## Project Structure

```
track-magento-playwright-ts-automation/
├── .gitignore               # Ignore node_modules, reports, env files, etc.
├── package.json             # Project metadata, dependencies, and test scripts
├── tsconfig.json            # TypeScript configuration
├── playwright.config.ts     # Global Playwright configuration (test settings, timeout, browser, baseURL)
├── README.md                # Project overview, usage instructions, and setup
├── .github/                 # GitHub-specific configs
│   └── workflows/
│       └── playwright.yml   # CI/CD setup for Playwright on GitHub Actions

├── helpers/                 # Utility & helper files
│   ├── adBlockUtils.ts         # Example: Disable adblock/popups 
│   ├── assertionHelper.ts      # Reusable custom assertions 
│   └── testData.ts             # Centralized test data 

├── pages/                  # Page Object Model (POM) structure
│   ├── BasePage.ts              # Base page with common actions (goTo, etc.)
│   ├── HomePage.ts              # Home page locators and actions if needed
│   ├── HeaderPage.ts            # Header (Category, subcategory and options)
│   ├── ProductListingPage.ts    # Category/product selection
│   ├── ProductDetailsPage.ts    # Select size/color, add to cart
│   ├── CartPage.ts              # View/edit shopping cart
│   ├── CheckoutPage.ts          # Fill checkout form and confirm
│   └── index.ts                 # Export all page objects from a single file

├── tests/                  # All test specs go here
│   └── e2e.spec.ts             # Example end-to-end scenario: Home → Product → Cart → Checkout

├── test-results/           # Playwright-generated test artifacts (screenshots, traces)
├── playwright-report/      # HTML test report generated after test runs

```

## Prerequisites

- Node.js (LTS version recommended)
- npm
- Playwright browsers (installed automatically)


## Installation

1. Clone the repository:
   ```bash
   git clone <https://github.com/mtekin72/track-magento-playwright-ts-automation.git>
   cd track-magento-playwright-ts-automation
   npm ci
   npx playwright install --with-deps
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Run e2e Tests
```bash
npm run test:e2e
```

## Test Reports

html-report/index.html


## Test Coverage

The main E2E flows covered:

Product selection by category, size, color, and quantity

Filter by attributes (Size, Color, Activity, etc.)

Cart and quantity validation

Checkout with discount (20poff) and Netherlands shipping verification

Random valid product add-to-cart and error handling

### Manual/Automated Bug Reports
During test execution, these real site issues were discovered:

1. Quantity Mis-match When Adding Multiple Items <br/>
Issue: Cart still shows 1 item, not 2.<br/>
Scenario: Add a product to cart with quantity 2.<br/>
Status: Automation test scenario fails on asserting cart quantity. Manual browser test confirms bug.

2. Incorrect Product Color Reflected in Cart Image
Scenario: Select a product with color "Blue".<br/>
Issue: image shows a different color  than the selected colour.<br/>
Status: Automation checks color matching and fails; manual test confirms image/selection mismatch.

3. Random Product Add<br/>
Scenario: Randomly select a product.<br/>
Issue:Even there is no stock issue mentioned, requested quantity show unavailable and test fails for some products.


**AI usage**  
   - **Usage**: GitHub Copilot was utilized to improve code readability, to generate the visual project structure outlined in the project structure section & support with improving playwright.yml file.

## CI/CD Integration

This project uses GitHub Actions for CI/CD. The workflow is defined in `.github/workflows/playwright.yml`. 

**Reports in pipeline**  
   - **e2e Test Report**: Report can be found under the action tab and the respective job steps. 

