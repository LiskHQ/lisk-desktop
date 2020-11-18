/* eslint-disable */
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import networks from '../../../constants/networks';
import ss from '../../../constants/selectors';
import urls from '../../../constants/urls';
import accounts from '../../../constants/accounts';
import compareBalances from '../../utils/compareBalances';

const transactionFee = 0.001430143;

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

Then(/^It should change fee when changing priorities$/, function () {
  const promise1 = new Promise((resolve) => {
    cy.get(ss.lowPriorityFee).click();
    cy.get(ss.feeValue).invoke('text').then(resolve);
  });
  const promise2 = new Promise((resolve) => {
    cy.get(ss.mediumPriorityFee).click();
    cy.get(ss.feeValue).invoke('text').then(resolve);
  });
  const promise3 = new Promise((resolve) => {
    cy.get(ss.highPriorityFee).click();
    cy.get(ss.feeValue).invoke('text').then(resolve);
  });  

  Promise.all([promise1, promise2, promise3])
    .then((values) => {
      const lowFee = values[0];
      const mediumFee = values[1];
      const highFee = values[2];
      cy.wrap(null).should(() => {
        expect(lowFee).to.not.equal(mediumFee);
        expect(lowFee).to.not.equal(highFee);
        expect(mediumFee).to.not.equal(highFee);
      })
    });
});