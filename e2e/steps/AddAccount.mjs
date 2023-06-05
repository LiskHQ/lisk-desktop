/* eslint-disable new-cap */
import { Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

setDefaultTimeout(15 * 1000);

Then('custom derivation path input field should be {string}', async function (state) {
  if (state === 'enabled') {
    await expect(this.page.getByText('Custom derivation path', { exact: true })).toBeTruthy();
    await expect(this.page.getByTestId('custom-derivation-path')).toBeTruthy();
  } else {
    await expect(
      await this.page.getByText('Custom derivation path', { exact: true }).count()
    ).toEqual(0);
  }
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
