import { setWorldConstructor } from '@cucumber/cucumber';
import playwright from 'playwright';

class CustomWorld {
  async openUrl(path) {
    this.pageBaseUrl = 'http://localhost:8080/#';

    const browser = await playwright.chromium.launch({
      headless: false,
    });
    const context = await browser.newContext();

    this.page = await context.newPage();

    await this.page.goto(`${this.pageBaseUrl}${path}`);
  }
}

setWorldConstructor(CustomWorld);
