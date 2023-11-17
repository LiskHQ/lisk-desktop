/* eslint-disable new-cap */
import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { fixture } from '../fixtures/page.mjs';

When('I click on the first row of transaction events', async () => {
  await fixture.page.locator('.event-block-height').nth(0).click();
});

When('I copy the first detail on the page', async () => {
  await fixture.page.getByAltText('copy').nth(0).click();
});

Then('I should see event filter details', async () => {
  const transactionEventsFilterWrapper = fixture.page.locator(
    '.filterTransactions + div[data-testid="dropdown-popup"]'
  );
  await expect(transactionEventsFilterWrapper.filter({ hasText: 'Transaction ID' })).toBeVisible();
  await expect(transactionEventsFilterWrapper.filter({ hasText: 'Block ID' })).toBeVisible();
  await expect(transactionEventsFilterWrapper.filter({ hasText: 'Block height' })).toBeVisible();
});

When('I fill in copied detail for {string}', async (filter) => {
  const transactionFilterMap = {
    'Transaction ID': 'transactionID',
    'Block ID': 'blockID',
    'Block height': 'height',
    'Sender address': 'senderAddress',
  };
  const text = await fixture.page.evaluate('navigator.clipboard.readText()');
  await fixture.page.getByTestId(transactionFilterMap[filter]).fill(text);
});
