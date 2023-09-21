/* eslint-disable new-cap */
import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import routes from '../fixtures/routes.mjs';
import { fixture } from '../fixtures/page.mjs';

Then('I should see {int} validators in table', async (number) => {
  await expect(fixture.page.getByTestId('validator-row')).toHaveCount(number);
});

When('I select {string} validator in table', async (validatorName) => {
  fixture.page.getByText(validatorName, { exact: true }).click();
  const validatorNameRegex = new RegExp(`^${validatorName}`);
  const validatorAddress = fixture.page
    .getByRole('link', { name: validatorNameRegex })
    .getAttribute('href');
  fixture.page.goto(
    `${process.env.PW_BASE_URL}/${routes.validatorProfile}?validatorAddress=${validatorAddress}`
  );
});
