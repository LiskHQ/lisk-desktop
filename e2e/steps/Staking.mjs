/* eslint-disable new-cap */
import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { fixture } from '../fixtures/page.mjs';

Then('I should see {int} validators in table', async (number) => {
  await expect(fixture.page.getByTestId('validator-row')).toHaveCount(number);
});

Then('I should see {string} validator details', async (validatorName) => {
  await expect(await fixture.page.locator('.details-container')).toContainText(validatorName);
  await expect(fixture.page.getByText('Details', { exact: true })).toBeVisible();
  await expect(fixture.page.getByText('Performance', { exact: true })).toBeVisible();
  await expect(fixture.page.getByText('Last generated at', { exact: true })).toBeVisible();
  await expect(fixture.page.getByText('Blocks generated', { exact: true })).toBeVisible();
});
