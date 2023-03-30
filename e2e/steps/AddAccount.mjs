/* eslint-disable new-cap */
import { Given, When } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';

Given('I navigate to page {string}', async (props) => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  const page = await context.newPage();
  await page.goto('http://localhost:8080/#/');

  expect(page.getByText('lisk')).toContain('lisk');
});

When(/^I go to page: (\w+)$/, () => {
  //   const browser = chromium.launch({ headless: false });
  //   const context = await browser.newContext();

  expect('kjdfa').toBe('kajsdjfasf');
});
