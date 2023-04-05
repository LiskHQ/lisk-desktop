/* eslint-disable new-cap */
import { Given, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import routes from '../fixtures/routes.mjs';

Given('I navigate to page {string}', async function (pageName) {
  await this.openUrl(`http://localhost:8080/#${routes[pageName]}`);

  this.page.getByText('oqijewiqjwiejfaqwdofnaowejf ').click()
  // expect(this.page.getByText('Choose an option to add your account to Lisk wallet.')).toHaveText('Add your account');
});

When(/^I go to page: (\w+)$/, () => {
  //   const browser = chromium.launch({ headless: false });
  //   const context = await browser.newContext();

  expect('kjdfa').toBe('kajsdjfasf');
});
