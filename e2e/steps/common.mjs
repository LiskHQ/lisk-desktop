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
  await expect(this.page.url()).toBe(`#/${route}`);
});
