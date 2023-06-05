import { setWorldConstructor, setDefaultTimeout } from '@cucumber/cucumber';
import playwright from 'playwright';

class CustomWorld {
  async openUrl(path) {
    this.pageBaseUrl = process.env.PW_BASE_URL;

    const browser = await playwright.chromium.launch({
      headless: true,
    });
    const context = await browser.newContext();

    this.page = await context.newPage();

    await this.page.goto(`${this.pageBaseUrl}${path}`);
  }
}

setDefaultTimeout(10 * 1000);
setWorldConstructor(CustomWorld);
