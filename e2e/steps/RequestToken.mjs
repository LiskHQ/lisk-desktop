/* eslint-disable new-cap */
import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { fixture } from '../fixtures/page.mjs';

Then(
  '{string} should be selected in {string} dropdown',
  { timeout: 500 },
  async function (selectedText, dropdownTitle) {
    const title = fixture.page
      .getByText(dropdownTitle, { exact: true })
      .locator('..')
      .getByTestId('selected-menu-item')
      .getByText(selectedText, { exact: true });
    const content = await title.textContent();
    expect(content).toBeTruthy();
  }
);
