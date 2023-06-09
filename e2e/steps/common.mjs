/* eslint-disable new-cap */
import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import routes from '../fixtures/routes.mjs';

Given('I navigate to page {string}', { timeout: 160 * 1000 }, async function (pageName) {
  await this.openUrl(routes[pageName]);
});

Given('I wait for {string}', async function (waitTime) {
  await this.page.waitFor(+waitTime);
});

Given('I click on a button with text {string}', async function (buttonText) {
  await this.page.getByText(buttonText, { exact: true }).click();
});

Given('I click on a button with testId {string}', async function (testId) {
  await this.page.getByTestId(testId).click();
});

Given('I click on text {string}', async function (text) {
  await this.page.getByText(text).click();
});

Then('I should see {string}', async function (textContent) {
  await expect(this.page.getByText(textContent, { exact: true })).toBeVisible();
});

Then('I should possibly see {string}', async function (textContent) {
  await expect(this.page.getByText(textContent)).toBeVisible();
});

Then('I should see an image with alt text {string}', async function (altText) {
  await expect(this.page.getByAltText(altText)).toBeVisible();
});

Then('I should be redirected to route: {string}', { timeout: 120 * 1000 }, async function (route) {
  await expect(this.page.url()).toBe(`${process.env.PW_BASE_URL}/${route}`);
});

Then('button with text {string} should be disabled', async function (textContent) {
  await expect(this.page.getByText(textContent, { exact: true })).toBeDisabled();
});

// eslint-disable-next-line max-statements
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

Given(
  'I upload from file {string} with json content:',
  async function (filename, encryptedAccountJson) {
    await this.page.setInputFiles('input[role=button]', {
      name: `${filename}.json`,
      mimeType: 'application/json',
      buffer: Buffer.from(encryptedAccountJson),
    });
  }
);

Given('I switch to network {string}', async function (networkName) {
  await this.page.getByTestId('network-application-trigger').click();
  await expect(this.page.getByTestId('spinner')).not.toBeVisible({ timeout: 10000 });
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
