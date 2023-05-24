/* eslint-disable new-cap */
import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import routes from '../fixtures/routes.mjs';

Given('I navigate to page {string}', { timeout: 120 * 1000 }, async function (pageName) {
  await this.openUrl(routes[pageName]);
});

Given('I click on a button with exact text {string}', async function (buttonText) {
  await this.page.getByText(buttonText, { exact: true }).click();
});

Given('I click on a button with testId {string}', async function (testId) {
  await this.page.getByTestId(testId).click();
});

Given('I click on text {string}', async function (text) {
  await this.page.getByText(text, { exact: true }).click();
});

Then('I should exactly see {string}', async function (textContent) {
  await expect(this.page.getByText(textContent, { exact: true })).toBeVisible();
});

Then('I should see {string}', async function (textContent) {
  await expect(this.page.getByText(textContent)).toBeVisible();
});

Then('I should see an image with alt text {string}', async function (altText) {
  await expect(this.page.getByAltText(altText)).toBeVisible();
});

Then('I should be redirected to route: {string}', async function (route) {
  await expect(this.page.url()).toBe(`${process.env.PW_BASE_URL}/${route}`);
});

Then('button with text {string} should be disabled', async function (textContent) {
  await expect(this.page.getByText(textContent, { exact: true })).toBeDisabled();
});

Given('I fill in mnemonic phrases {string}', async function (passPhrase) {
  const phrases = passPhrase.split(' ');

  for (let index = 0; index < phrases.length; index++) {
    // eslint-disable-next-line no-await-in-loop
    await this.page.getByTestId(`recovery-${index}`).fill(phrases[index]);
  }
});

Given('I type {string} in {string}', async function (text, dataTestId) {
  await this.page.getByTestId(dataTestId).fill(text);
});

Then(
  'I should be on the password collection step having address: {string} and account name {string}',
  async function (address, accountName) {
    await expect(this.page.getByText('Enter your account password', { exact: true })).toBeTruthy();
    await expect(this.page.getByText(address, { exact: true })).toBeTruthy();
    await expect(this.page.getByText(accountName, { exact: true })).toBeTruthy();
    await expect(
      this.page.getByText(
        'Please enter your account password to backup the secret recovery phrase.',
        { exact: true }
      )
    ).toBeTruthy();
  }
);

Given('I upload json content:', async function (encryptedAccountJson) {
  await this.page.setInputFiles('input[role=button]', {
    name: 'encrypted_account.json',
    mimeType: 'application/json',
    buffer: Buffer.from(encryptedAccountJson),
  });
});

Given('I switch to network {string}', async function (networkName) {
  await this.page.getByTestId('network-application-trigger').click();
  await this.page.getByTestId('selected-menu-item').click();
  await this.page.getByText(networkName).click();
});

Given('I go back to the previous page', async function () {
  await this.page.goBack();
});

Given(
  'I add a custom network with name {string} and serviceUrl {string}',
  async function (networkName, serviceUrl) {
    await this.page.getByTestId('network-application-trigger').click();
    await this.page.getByText('Add network').click();

    await this.page.getByTestId('name').fill(networkName);
    await this.page.getByTestId('serviceUrl').fill(serviceUrl);
    await this.page
      .locator('[type="submit"]')
      .filter({
        hasText: 'Add network',
      })
      .click();
  }
);
