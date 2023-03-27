/* eslint-disable */
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { ss, urls } from '../../../constants';
import compareBalances from '../../utils/compareBalances';

const transactionFee = 0.00142;

const errorMessage = 'Test error';

Then(/^I follow the launch protocol link$/, function () {
  cy.visit(
    `${urls.send}&recipient=lsk2h73o3bqa4v2u3ehn6c5e787ky38q8wte538mn&amount=5&reference=test%20message&token=20a19acd98003d&recipientApplication=aq02qkbb35u4jdq8szo3pnsq`
  );
});

Then(/^Send form fields are prefilled$/, function () {
  cy.get(ss.recipientInput).should('have.value', 'lsk2h73o3bqa4v2u3ehn6c5e787ky38q8wte538mn');
  cy.get(ss.amountInput).should('have.value', '5');
  cy.get(ss.messageTextArea).should('have.value', 'test message');

  cy.get('div[data-testid="selected-menu-item"]').eq(0).should('have.text', 'Lisk');
  cy.get('div[data-testid="selected-menu-item"]').eq(1).should('have.text', 'Lisk');
  cy.get('div[data-testid="selected-menu-item"]').eq(2).should('have.text', 'Enevti');
});

Then(/^I mock api \/transactions$/, function () {
  cy.intercept(
    {
      method: 'POST',
      url: 'http://127.0.0.1:9901/api/v3/transactions',
    },
    {
      statusCode: 409,
      body: { message: errorMessage },
    }
  );
});

Given(/^I mock api \/transactions$/, function () {
  cy.intercept(
    {
      method: 'POST',
      url: 'http://localhost:9901/api/v3/transactions',
    },
    {
      statusCode: 409,
      body: { message: errorMessage },
    }
  );
});

Then(/^I see error message$/, function () {
  cy.get(ss.submittedTransactionMessage).contains(errorMessage);
});

Given(/^I remember my balance$/, function () {
  cy.get(ss.accountBalance).invoke('text').as('balanceBefore');
});

Then(/^The balance is subtracted$/, function () {
  cy.get(ss.accountBalance)
    .invoke('text')
    .as('balanceAfter')
    .then(function () {
      compareBalances(this.balanceBefore, this.balanceAfter, transactionFee);
    });
});
