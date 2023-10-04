/* eslint-disable new-cap */
import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { fixture } from '../fixtures/page.mjs';

Then('I should see send form details', async () => {
  const formWrapper = fixture.page.getByTestId('send-form-wrapper');
  await expect(formWrapper.filter({ hasText: 'Send tokens' })).toBeVisible();
  await expect(formWrapper.filter({ hasText: 'From application' })).toBeVisible();
  await expect(formWrapper.filter({ hasText: 'To application' })).toBeVisible();
  await expect(formWrapper.filter({ hasText: 'Token' })).toBeVisible();
  await expect(formWrapper.filter({ hasText: 'Amount' })).toBeVisible();
  await expect(formWrapper.filter({ hasText: 'Recipient address' })).toBeVisible();
});

Then('the first transaction row should contain latest transaction details', async () => {
  await expect(fixture.page.locator('.transactions-row').nth(0).toContainText('Token transfer'));
  await expect(fixture.page.locator('.transactions-row').nth(0).toContainText('Today at'));
});
