/* eslint-disable */
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import networks from '../../../constants/networks';
import ss from '../../../constants/selectors';
import urls from '../../../constants/urls';
import accounts from '../../../constants/accounts';
import compareBalances from '../../utils/compareBalances';

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




