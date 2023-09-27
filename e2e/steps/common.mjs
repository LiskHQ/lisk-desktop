/* eslint-disable new-cap */
import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import routes from '../fixtures/routes.mjs';
import { fixture } from '../fixtures/page.mjs';

Then('I go to page {string}', async (pageName) => {
  await fixture.page.goto(`${process.env.PW_BASE_URL}${pageName}`);
});

Given(
  'I add an account with passphrase {string} password {string} name {string}',
  async (passphrase, password, name, customDerivationInfo) => {
    const returnUrl = fixture.page.url();
    await fixture.page.goto(`${process.env.PW_BASE_URL}${routes.wallet}`);
    await fixture.page.getByText('Add account', { exact: true }).click();
    await fixture.page.getByText('Secret recovery phrase', { exact: true }).click();

    const phrases = passphrase.split(' ');
    for (let index = 0; index < phrases.length; index++) {
      // eslint-disable-next-line no-await-in-loop
      await fixture.page
        .getByTestId(`recovery-${index}`)
        .type(`${phrases[index]}${phrases.length === 12 ? '' : ' '}`);
    }
    if (customDerivationInfo) {
      const customDerivationPath = customDerivationInfo.replace('Custom derivation path ', '');
      await fixture.page.getByTestId('custom-derivation-path').fill(customDerivationPath);
    }

    await fixture.page.getByText('Continue to set password', { exact: true }).click();
    await fixture.page.getByTestId('password').fill(password);
    await fixture.page.getByTestId('cPassword').fill(password);
    await fixture.page.getByTestId('accountName').fill(name);
    await fixture.page
      .getByText('I agree to store my encrypted secret recovery phrase on this device.', {
        exact: true,
      })
      .click();
    await fixture.page.getByText('Save Account', { exact: true }).click();
    await fixture.page.goto(`${returnUrl}`);
  }
);

Given('I click on a button with text {string}', async (buttonText) => {
  await fixture.page.getByText(buttonText, { exact: true }).click();
});

Then('Clipboard should contain {string}', async (clipboardText) => {
  const text = await fixture.page.evaluate('navigator.clipboard.readText()');
  expect(text).toContain(clipboardText);
});

Given('I click on an element with testId {string}', async (testId) => {
  await fixture.page.getByTestId(testId).click();
});

Given('I click on text {string}', async (text) => {
  await fixture.page.getByText(text).click();
});

Given('I wait for {string}', async (timeout) => {
  const [time, unit] = timeout.match(/(^\d+)\s|(seconds?|minutes?)/g);
  const unitMultiplier = {
    second: 1000,
    minute: 3600000,
  };

  if (!unit) {
    throw new Error('Invalid timeout unit provided. Unit can be either seconds or minutes');
  }
  const unitKey = unit.replace(/s$/, '');
  await new Promise((res) => setTimeout(res, +time * unitMultiplier[unitKey]));
});

Then('I should see {string}', async (textContent) => {
  await expect(fixture.page.getByText(textContent, { exact: true })).toBeVisible();
});

Then('I should possibly see {string}', async (textContent) => {
  await expect(fixture.page.getByText(textContent)).toBeVisible();
});

Then('I should see an image with alt text {string}', async (altText) => {
  await expect(fixture.page.getByAltText(altText)).toBeVisible();
});

Then('I should be redirected to route: {string}', async (route) => {
  await expect(fixture.page.url()).toBe(`${process.env.PW_BASE_URL}/${route}`);
});

Then('button with text {string} should be disabled', async (textContent) => {
  await expect(fixture.page.getByText(textContent, { exact: true })).toBeDisabled();
});

Then('button with text {string} should be enabled', async (textContent) => {
  await expect(fixture.page.getByText(textContent, { exact: true })).not.toBeDisabled();
});

// eslint-disable-next-line max-statements
Given('I fill in mnemonic phrases {string}', async (passPhrase) => {
  const phrases = passPhrase.split(' ');

  for (let index = 0; index < phrases.length; index++) {
    // eslint-disable-next-line no-await-in-loop
    await fixture.page.getByTestId(`recovery-${index}`).type(phrases[index]);
  }
});

Given('I type {string} in {string}', async (text, dataTestId) => {
  await fixture.page.getByTestId(dataTestId).fill(text);
});

Then(
  'I should be on the password collection step having address: {string} and account name {string}',
  async (address, accountName) => {
    await expect(
      fixture.page.getByText('Enter your account password', { exact: true })
    ).toBeTruthy();
    await expect(fixture.page.getByText(address, { exact: true })).toBeTruthy();
    await expect(fixture.page.getByText(accountName, { exact: true })).toBeTruthy();
    await expect(
      fixture.page.getByText(
        'Please enter your account password to backup the secret recovery phrase.',
        {
          exact: true,
        }
      )
    ).toBeTruthy();
  }
);

Given('I upload from file {string} with json content:', async (filename, encryptedAccountJson) => {
  await fixture.page.setInputFiles('input[role=button]', {
    name: `${filename}.json`,
    mimeType: 'application/json',
    buffer: Buffer.from(encryptedAccountJson),
  });
});

Given('I switch to network {string}', async (networkName) => {
  if (!(await fixture.page.getByText('Add application'))) {
    await fixture.page.getByTestId('network-application-trigger').click();
  }
  await expect(fixture.page.getByTestId('spinner')).not.toBeVisible();
  await fixture.page.getByTestId('selected-menu-item').click();
  await fixture.page.getByText(networkName, { exact: true }).click();
});

Given('I go back to the previous page', async () => {
  await fixture.page.goBack();
});

Given(
  'I add a custom network with name {string} and serviceUrl {string}',
  async (networkName, serviceUrl) => {
    await fixture.page.getByTestId('network-application-trigger').click();
    await fixture.page.getByText('Add network').click();

    await fixture.page.getByTestId('name').fill(networkName);
    await fixture.page.getByTestId('serviceUrl').fill(serviceUrl);
    await expect(await fixture.page.getByTestId('add-network-button')).not.toBeDisabled();
    await fixture.page.getByTestId('add-network-button').click();
  }
);

Then('{string} should be selected in {string} dropdown', async (selectedText, dropdownTitle) => {
  const title = fixture.page
    .getByText(dropdownTitle, { exact: true })
    .locator('..')
    .getByTestId('selected-menu-item')
    .getByText(selectedText, { exact: true });
  const content = await title.textContent();
  expect(content).toBeTruthy();
});

Then('Element {string} should contain class {string}', async (testId, className) => {
  const regex = new RegExp(className);
  await expect(fixture.page.getByTestId(testId)).toHaveClass(regex);
});

Then('Element {string} should not contain class {string}', async (testId, className) => {
  const selector = await fixture.page.getByTestId(testId);
  const classList = await selector.evaluate((el) => [...el.classList]);
  const hasClassname = classList.find((classItem) => classItem.includes(className));

  await expect(hasClassname).toBeFalsy();
});
