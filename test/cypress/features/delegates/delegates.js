/* eslint-disable */
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import accounts from '../../../constants/accounts';
import ss from '../../../constants/selectors';
import networks from '../../../constants/networks';
import compareBalances from '../../utils/compareBalances';
import urls from '../../../constants/urls';

Given(/^I am on Delegates page$/, function () {
  cy.visit(urls.delegates);
  cy.get(ss.delegateName);
});

Then(/^I see (\d+) delegates on page$/, function (number) {
  cy.get(ss.delegateRow).should('have.length', number);
});

Then(/^I click load more button$/, function (number) {
  cy.get(ss.loadMoreButton).click();
});
