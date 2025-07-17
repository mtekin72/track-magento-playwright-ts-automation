import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  tsconfig: "./tsconfig.json",
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "html-report" }], 
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/results.xml" }],
    ["list"],
  ],
  use: {
    headless: true,

    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },

  projects: [
    {
      name: "e2e Tests",
      testDir: "./tests/",
      use: {
        baseURL: "https://magento.softwaretestingboard.com/",
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});

