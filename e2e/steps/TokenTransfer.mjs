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

Then(
  'I should see {string} should be selected in {string} dropdown',
  async (selectedText, dropdownTitle) => {
    const title = fixture.page
      .getByText(dropdownTitle, { exact: true })
      .locator('..')
      .locator('..')
      .getByTestId('selected-menu-item')
      .getByText(selectedText, { exact: true });
    const content = await title.textContent();
    expect(content).toBeTruthy();
  }
);

Then('the first transaction row should contain latest transaction details', async () => {
  await expect(fixture.page.locator('.transactions-row').nth(0)).toContainText(/Token transfer/i);
  await expect(fixture.page.locator('.transactions-row').nth(0)).toContainText(/Today at/i);
});

Then('I should see event table details', async () => {
  await expect(
    fixture.page.locator('.transaction-events-header').filter({ hasText: 'Block height' })
  ).toBeVisible();
  await expect(
    fixture.page.locator('.transaction-events-header').filter({ hasText: 'Transaction ID' })
  ).toBeVisible();
  await expect
    .poll(() => fixture.page.locator('.transaction-event-row').count())
    .toBeGreaterThan(0);
});

Then('I should see token table details', async () => {
  await expect(
    fixture.page.locator('.token-table-header').filter({ hasText: 'Token balance' })
  ).toBeVisible();
  await expect(
    fixture.page.locator('.token-table-header').filter({ hasText: 'Available balance' })
  ).toBeVisible();
  await expect(
    fixture.page.locator('.token-table-header').filter({ hasText: 'Locked balance' })
  ).toBeVisible();
  await expect(
    fixture.page.locator('.token-table-header').filter({ hasText: 'Fiat balance' })
  ).toBeVisible();
  await expect.poll(() => fixture.page.locator('.token-row').count()).toBeGreaterThan(0);
});

Then('token balance should be greater than {int}', async (minBalance) => {
  const currentBalance = await fixture.page.locator('.token-row > div:nth-child(2)').innerText();
  expect(parseFloat(currentBalance)).toBeGreaterThan(minBalance);
});
