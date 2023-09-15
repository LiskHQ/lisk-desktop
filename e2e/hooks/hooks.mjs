import { BeforeAll, AfterAll, Before } from '@cucumber/cucumber';
import playwright from 'playwright';
import { fixture } from '../fixtures/page.mjs';

let browser;

BeforeAll(async function () {
  browser = await playwright.chromium.launch({
    headless: true,
    args: ['--disable-web-security', '--allow-running-insecure-content'],
  });
});

Before(async function () {
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const newPage = await context.newPage();
  await newPage.goto(`${process.env.PW_BASE_URL}`);

/*   await newPage.evaluate(() => {
    const networkName = 'local_network';
    const serviceUrl = 'http://127.0.0.1:9901';

    const customNetwork = {
      serviceUrl: serviceUrl,
      wsServiceUrl: serviceUrl,
      isAvailable: true,
      name: networkName,
      label: networkName,
    };

    window.store.dispatch({
      type: 'SETTINGS_UPDATED',
      data: {
        customNetworks: [customNetwork],
      },
    });
    window.store.dispatch({
      type: 'SETTINGS_UPDATED',
      data: {
        mainChainNetwork: customNetwork,
      },
    });
  }); */

  fixture.page = newPage;
});

AfterAll(async function () {
  await browser.close();
});
