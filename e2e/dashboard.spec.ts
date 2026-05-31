import { test, expect } from "@playwright/test";

test.describe("Dashboard UI Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display header and basic layout", async ({ page }) => {
    // Header check
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("header").getByText("FluxFinance")).toBeVisible();

    // Market ticker check
    const ticker = page.locator(".overflow-hidden").first();
    await expect(ticker).toBeVisible();

    // Main layout check
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });

  test("should display default stock cards", async ({ page }) => {
    // Wait for the data to load
    await expect(page.locator("main button")).toHaveCount(4, {
      timeout: 10000,
    });

    const stockCards = page.locator("main button");
    await expect(stockCards.nth(0)).toBeVisible();

    // Check if GRRR card is present
    await expect(page.locator("h3:has-text('GRRR')").first()).toBeVisible();
  });

  test("should open and close chart modal", async ({ page }) => {
    // Wait for cards and click the first one
    const firstCard = page.locator("main button").first();
    await firstCard.waitFor({ state: "visible" });
    await firstCard.click();

    // Check if modal opens
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Check time range controls
    await expect(modal.getByRole("button", { name: "1M" })).toBeVisible();

    // Close modal
    await modal.getByRole("button", { name: "閉じる" }).click();
    await expect(modal).not.toBeVisible();
  });
});
