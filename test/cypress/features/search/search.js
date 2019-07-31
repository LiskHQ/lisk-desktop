/* eslint-disable */
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import networks from '../../../constants/networks';
import ss from '../../../constants/selectors';
import accounts from '../../../constants/accounts';

const testnetTransaction = '755251579479131174';
const mainnetTransaction = '881002485778658401';
const devnetTransaction = '1260852969019107586';

Then(/^I open search$/, function () {
  cy.get(ss.searchIcon).click();
});

Then(/^I search for account ([^s]+)$/, function (string) {
  cy.server();
  cy.route('/api/accounts**').as('requestAccount');
  cy.route('/api/delegates**').as('requestDelegate');
  cy.get(ss.searchInput).type(string);
  cy.wait('@requestAccount');
  cy.wait('@requestDelegate');
});

Then(/^I search for delegate ([^s]+)$/, function (string) {
  cy.server();
  cy.route('/api/delegates**').as('requestDelegate');
  cy.wait(100);
  cy.get(ss.searchInput).type(string);
  cy.wait('@requestDelegate');
});

Then(/^I search for transaction ([^s]+)$/, function (string) {
  cy.server();
  cy.route('/api/transactions**').as('requestTransaction');
  cy.get(ss.searchInput).type(string);
  cy.wait('@requestTransaction');
});

Then(/^I open account suggestion$/, function () {
  cy.get(ss.searchAccountRow).eq(0).click();
});

Then(/^I open delegate suggestion$/, function () {
  cy.get(ss.searchDelegatesRow).eq(0).click();
});

Then(/^I open transaction suggestion$/, function () {
  cy.get(ss.searchTransactionRow).eq(0).click();
});

Then(/^I should see no results$/, function () {
  cy.get(ss.searchMessage).eq(0).should('have.text', 'Nothing has been found. Make sure to double check the ID you typed.');
});


