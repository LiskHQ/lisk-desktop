/* eslint-disable new-cap */
import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import routes from '../fixtures/routes.mjs';
import waitFor from '../utilities/waitFor.mjs';

Given('I navigate to page {string}', async function (pageName) {
  await this.openUrl(routes[pageName]);
});

Given('I switch to network {string}', async function (network) {
  await this.openUrl(routes.selectNetwork);
  await waitFor(1000);
  await this.page.getByTestId('selected-menu-item').click();
  await this.page.getByText(network, { exact: true }).click();

  await expect(this.page.getByText('Alphanet', { exact: true })).toBeVisible();
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

Then('I may see {string}', async function (textContent) {
  await expect(this.page.getByText(textContent)).toBeVisible();
});

Then('I should see an image with alt text {string}', async function (altText) {
  await expect(this.page.getByAltText(altText)).toBeVisible();
});

Then('I should be redirected to route: {string}', async function (route) {
  await expect(this.page.url()).toBe(`http://localhost:8080/#/${route}`);
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
    await expect(
      this.page.getByText('Enter your account password', { exact: true })
    ).toBeDisabled();
    await expect(this.page.getByText(address, { exact: true })).toBeDisabled();
    await expect(this.page.getByText(accountName, { exact: true })).toBeDisabled();
    await expect(
      this.page.getByText(
        'Please enter your account password to backup the secret recovery phrase.',
        { exact: true }
      )
    ).toBeDisabled();
  }
);
