import { BeforeAll, AfterAll, Before, After, setDefaultTimeout, Status } from '@cucumber/cucumber';
import playwright from 'playwright';
import { fixture } from '../fixtures/page.mjs';
import { BASE_NETWORK } from '../fixtures/networks.mjs';

let browser;
let context;

setDefaultTimeout(10000);

BeforeAll(async function () {
  browser = await playwright.chromium.launch({
    headless: false,
    args: [
      '--disable-web-security',
      '--allow-running-insecure-content',
      '--unsafely-treat-insecure-origin-as-secure',
      '--headless=new',
    ],
  });
});

Before(async function () {
  context = await browser.newContext({
    ignoreHTTPSErrors: true,
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const newPage = await context.newPage();
  await newPage.goto(`${process.env.PW_BASE_URL}`);

  const networkName = BASE_NETWORK.name;
  const serviceUrl = BASE_NETWORK.serviceUrl;
  await newPage.getByTestId('network-application-trigger').click();
  await newPage.getByText('Add network').click();

  await newPage.getByTestId('name').fill(networkName);
  await newPage.getByTestId('serviceUrl').fill(serviceUrl);
  await newPage.getByTestId('add-network-button').click();

  await newPage.getByTestId('selected-menu-item').click();
  await newPage.getByText(networkName, { exact: true }).click();
  await newPage.goto(`${process.env.PW_BASE_URL}`);

  fixture.page = newPage;
});

After(async function ({ pickle, result }) {
  let img;
  const isFailedStep = result?.status === Status.FAILED;

  if (isFailedStep) {
    img = await fixture.page.screenshot({
      path: `./e2e/assets/screenshots/${pickle.name}.png`,
      type: 'png',
    });
  }

  await fixture.page.close();
  await context.close();

  if (isFailedStep) {
    await this.attach(img, 'image/png');
  }
});

AfterAll(async function () {
  await browser.close();
});
