/* eslint-disable new-cap */
import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Then('To be written {string}', async function (state) {
  if (state === 'enabled') {
    await expect(this.page.getByText('Custom derivation path', { exact: true })).toBeTruthy();
    await expect(this.page.getByTestId('custom-derivation-path')).toBeTruthy();
  } else {
    await expect(
      await this.page.getByText('Custom derivation path', { exact: true }).count()
    ).toEqual(0);
  }
});
