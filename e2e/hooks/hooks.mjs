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

Before(async function () {
  context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const newPage = await context.newPage();
  await newPage.goto(`${process.env.PW_BASE_URL}`);

  const networkName = 'devnet';
  const serviceUrl = 'http://devnet-service.liskdev.net:9901';
  await newPage.getByTestId('network-application-trigger').click({ timeout: 10000 });
  await newPage.getByText('Add network').click({ timeout: 10000 });

  await newPage.getByTestId('name').fill(networkName, { timeout: 10000 });
  await newPage.getByTestId('serviceUrl').fill(serviceUrl, { timeout: 10000 });
  await newPage.getByTestId('add-network-button').click({ timeout: 10000 });

  if (!(await newPage.getByText('Add application'))) {
    await newPage.getByTestId('network-application-trigger').click();
  }
  await newPage.getByTestId('selected-menu-item').click();
  await newPage.getByText(networkName, { exact: true }).click();

  fixture.page = newPage;
});

After(async function () {
  await fixture.page.close();
  await context.close();
});

AfterAll(async function () {
  await browser.close();
});
