/* eslint-disable */
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import networks from '../../../constants/networks';
import ss from '../../../constants/selectors';
import accounts from '../../../constants/accounts';

Then(/^I open votes tab$/, function () {
  cy.get(ss.votesTab).click();
});

Then(/^I see 30 delegates$/, function () {
  cy.get(ss.voteRow).should('have.length', 30);
});

Then(/^I click show more$/, function () {
  cy.get(ss.showMoreVotesBtn).click();
});

Then(/^I see more than 30 votes$/, function () {
  cy.get(ss.voteRow).should('have.length.greaterThan', 30);
});

Then(/^I see no votes$/, function () {
  cy.get(ss.voteRow).should('not.exist');
});

Then(/^I filter votes$/, function () {
  cy.get(ss.searchDelegateInput).click().type('genesis_17');
});

Then(/^I see (\d+) delegates in table$/, function (number) {
  cy.get(ss.voteRow).should('have.length', number);
});
