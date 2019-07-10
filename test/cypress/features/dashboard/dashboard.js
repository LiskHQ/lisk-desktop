/* eslint-disable */
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import networks from '../../../constants/networks';
import ss from '../../../constants/selectors';
import accounts from '../../../constants/accounts';
import urls from '../../../constants/urls';

Then(/^I click on recent transaction$/, function () {
  cy.get(ss.transactionRow).eq(0).click();
});

Then(/^I click on bookmark$/, function () {
  cy.get(ss.bookmarkAccount).eq(0).click();
});

Then(/^I have a bookmark saved$/, function () {
  window.localStorage.setItem('bookmarks', `[{"title":"Alice","address":"${accounts.genesis.address}","balance":101}]`);
});
