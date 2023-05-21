/* eslint-disable new-cap */
import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Then('custom derivation path input field should be enabled', async function () {
  await expect(this.page.getByText('Custom derivation path', { exact: true })).toBeTruthy();
  await expect(this.page.getByTestId('custom-derivation-path')).toBeTruthy();
});

Then('I should see the final add account step', async function () {
  await expect(this.page.getByText(`Perfect! You're all set`, { exact: true })).toBeTruthy();
  await expect(
    this.page.getByText(
      'You can now download your encrypted secret recovery phrase and use it to add your account on other devices.',
      { exact: true }
    )
  ).toBeTruthy();
});
