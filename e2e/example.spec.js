// @ts-check
const { test, expect } = require('@playwright/test');

test('visit add account page', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Lisk/);
});
