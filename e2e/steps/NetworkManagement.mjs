/* eslint-disable new-cap */
import { Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { fixture } from '../fixtures/page.mjs';

Given('I open edit network modal for network {string}', async function (networkName) {
  await fixture.page.getByTestId("selected-menu-item").click();
  await fixture.page.getByText(networkName, { exact: true }).hover();
  await fixture.page.getByText(networkName, { exact: true }).locator('..').locator('..').getByAltText('edit').click();
  await expect(fixture.page.getByText("Edit network", { exact: true })).toBeVisible();
});
