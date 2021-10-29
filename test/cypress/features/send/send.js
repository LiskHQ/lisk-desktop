/* eslint-disable */
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { ss, networks, accounts, urls } from '../../../constants';
import compareBalances from '../utils/compareBalances';

const transactionFee = 0.0026;

const errorMessage = 'Test error';

Then(/^I follow the launch protokol link$/, function () {
  cy.visit(`${urls.send}&recipient=4995063339468361088L&amount=5&reference=test`);
});

Then(/^Send form fields are prefilled$/, function () {
  cy.get(ss.recipientInput).should('have.value', '4995063339468361088L');
  cy.get(ss.amountInput).should('have.value', '5');
  cy.get(ss.sendReferenceText).should('have.value', 'test');
});

Then(/^I mock api \/transactions$/, function () {
  cy.server({ status: 409 });
  cy.route('POST', '/api/transactions', { message: errorMessage });
});

Then(/^I see error message$/, function () {
  cy.get(ss.submittedTransactionMessage).contains(errorMessage);
});

Given(/^I remember my balance$/, function () {
  cy.get(ss.accountBalance).invoke('text').as('balanceBefore');
});

Then(/^The balance is subtracted$/, function () {
  cy.get(ss.accountBalance).invoke('text').as('balanceAfter').then(function () {
    compareBalances(this.balanceBefore, this.balanceAfter, 5 + transactionFee);
  });
});
