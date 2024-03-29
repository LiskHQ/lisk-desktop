/* eslint-disable new-cap */
import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { fixture } from '../fixtures/page.mjs';

Then('I should see {int} validators in table', async (number) => {
  await expect(fixture.page.getByTestId('validator-row')).toHaveCount(number);
});

Then('I should select a random validator and see their details', async () => {
  const randomValidatorIndex = Math.floor(Math.random() * 101);
  const validatorRow = fixture.page.getByTestId('validator-row').nth(randomValidatorIndex);
  const randomValidatorName = await validatorRow.locator('.validator-name').innerText();
  await validatorRow.click();
  await expect(fixture.page.locator('.details-container')).toContainText(randomValidatorName);
  await expect(fixture.page.getByText('Details', { exact: true })).toBeVisible();
  await expect(fixture.page.getByText('Performance', { exact: true })).toBeVisible();
  await expect(fixture.page.getByText('Last generated at', { exact: true })).toBeVisible();
  await expect(fixture.page.getByText('Blocks generated', { exact: true })).toBeVisible();
});

Then('I should see {string} validator details', async (validatorName) => {
  await expect(fixture.page.locator('.details-container')).toContainText(validatorName);
  await expect(fixture.page.getByText('Details', { exact: true })).toBeVisible();
  await expect(fixture.page.getByText('Performance', { exact: true })).toBeVisible();
  await expect(fixture.page.getByText('Last generated at', { exact: true })).toBeVisible();
  await expect(fixture.page.getByText('Blocks generated', { exact: true })).toBeVisible();
});

Then(
  'I should see staking queue details for validator {string} with amount {string}',
  async (validatorName, amount) => {
    await expect(
      fixture.page.getByTestId('stake-form-wrapper').filter({ hasText: 'Staking queue' })
    ).toBeVisible();
    await expect(
      fixture.page.getByTestId('stake-form-wrapper').filter({ hasText: validatorName })
    ).toBeVisible();
    await expect(
      fixture.page.getByTestId('stake-form-wrapper').filter({ hasText: amount })
    ).toBeVisible();
  }
);

Then('I should see staking confirmation details with amount {string}', async (stakeAmount) => {
  await expect(fixture.page.getByText('Staking confirmed', { exact: true })).toBeVisible();
  await expect(
    fixture.page.getByText(`${stakeAmount} will be locked for staking.`, { exact: true })
  ).toBeVisible();
  await expect(fixture.page.getByText('Back to stakes', { exact: true })).toBeVisible();
});

Then('I should see unstaking confirmation details with amount {string}', async (stakeAmount) => {
  await expect(fixture.page.getByText('Staking confirmed', { exact: true })).toBeVisible();
  await expect(
    fixture.page.getByText(
      `${stakeAmount} will be available to unlock when the locking period ends.`,
      { exact: true }
    )
  ).toBeVisible();
  await expect(fixture.page.getByText('Back to stakes', { exact: true })).toBeVisible();
});

Then('I should see {int} stakes in stakes list', async (stakesCount) => {
  await expect(fixture.page.locator('.transaction-event-row')).toHaveCount(stakesCount);
});
