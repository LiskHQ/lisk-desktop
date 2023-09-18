import { BeforeAll, AfterAll, Before, After } from '@cucumber/cucumber';
import playwright from 'playwright';
import { fixture } from '../fixtures/page.mjs';

let browser;
let context;

BeforeAll(async function () {
  browser = await playwright.chromium.launch({
    headless: true,
    args: ['--disable-web-security', '--allow-running-insecure-content'],
  });
});

Before({ timeout: 12000 }, async function () {
  context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const newPage = await context.newPage();
  await newPage.goto(`${process.env.PW_BASE_URL}`);

  fixture.page = newPage;
});

After(async function () {
  await fixture.page.close();
  await context.close();
});

AfterAll(async function () {
  await browser.close();
});
