/* eslint-disable new-cap */
import { Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

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

Given('I input encrypted account:', async function (encryptedAccountJson) {
  //   await this.page.getByTestId('tx-sign-input').fill(encryptedAccountJson);
  //   await this.page.getByTestId('tx-sign-input').focus();
  await this.page.evaluate(async (text) => {
    document.querySelector('[data-testid="tx-sign-input"]').value = text;
    document.querySelector('[data-testid="tx-sign-input"]').focus();
    document.querySelector('[data-testid="tx-sign-input"]').select();
    document.execCommand('copy');

    document.querySelector('[data-testid="tx-sign-input"]').focus();
    document.querySelector('[data-testid="tx-sign-input"]').select();
    document.execCommand('paste');
    // const data = await navigator.clipboard.readText();
  }, encryptedAccountJson);

  //   await this.page.getByTestId('tx-sign-input').focus();
  //   await this.page.getByTestId('tx-sign-input').press('Control+c');
  //   await this.page.getByTestId('tx-sign-input').press('Control+v');
});
