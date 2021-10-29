/* eslint-disable */
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { ss, networks, accounts, urls } from '../../../constants';

const transactionFee = 0.1;

Then(/^I change active token to ([^s]+)$/, function (token) {
  switch (token) {
    case 'LSK':
      cy.get(ss.lskToken).click();
      break;
    case 'BTC':
      cy.get(ss.btcToken).click();
      break;
  }
});




