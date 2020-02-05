/* eslint-disable */
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import accounts from '../../../constants/accounts';
import ss from '../../../constants/selectors';
import networks from '../../../constants/networks';
import compareBalances from '../../utils/compareBalances';
import urls from '../../../constants/urls';

const txConfirmationTimeout = 20000;

Then(/^I see (\d+) delegates on page$/, function (number) {
  cy.get(ss.delegateRow).should('have.length', number);
});

Then(/^I click load more button$/, function (number) {
  cy.wait(300);
  cy.get(ss.loadMoreButton).click();
});

Then(/^I start voting$/, function () {
  cy.get(ss.startVotingButton).should('not.have.class', 'disabled');
  cy.get(ss.startVotingButton).click();
});

Then(/^Added votes counter shows (\d+)$/, function (number) {
  cy.get(ss.addedVotesCount).should('have.text', number.toString());
});

Then(/^Removed votes counter shows (\d+)$/, function (number) {
  cy.get(ss.removedVotesCount).should('have.text', number.toString());
});

Then(/^Total voting number shows (\d+)$/, function (number) {
  cy.get(ss.totalVotingNumber).should('have.text', number.toString());
});

Then(/^I choose the (\d+) delegate$/, function (number) {
  cy.get(ss.delegateRow).eq(number).as('dg');
  cy.get('@dg').click();
});

Then(/^I go to confirmation$/, function () {
  cy.get(ss.goToConfirmationButton).click();
});

Then(/^I see (\d+) removed vote$/, function (number) {
  cy.get(ss.removedVotes).should('have.length', number);
});

Then(/^I see (\d+) added vote$/, function (number) {
  cy.get(ss.addedVotes).should('have.length', number);
});

Then(/^I go back to delegates$/, function () {
  cy.get(ss.backToDelegatesButton).click();
});

Then(/^I see pending votes$/, function () {
  cy.get(ss.spinner).should('have.length', 1);
});

Then(/^I wait for pending vote to be approved$/, function () {
  cy.get(ss.spinner);
  cy.get(ss.spinner, { timeout: txConfirmationTimeout }).should('have.length', 0);
});

Then(/^Voted delegate become unchecked$/, function () {
  cy.get('@dg').find(ss.voteCheckbox, { timeout: txConfirmationTimeout }).should('have.class', 'unchecked');
});

Then(/^Voted delegate become checked$/, function () {
  cy.get('@dg').find(ss.voteCheckbox, { timeout: txConfirmationTimeout }).should('have.class', 'checked');
});


Then(/^Added votes counter shows (\d+)$/, function (number) {
  cy.get(ss.addedVotesCount).should('have.text', '1');
});

Then(/^I use launch protocol link to vote$/, function () {
  cy.visit(`${urls.delegatesVote}?votes=genesis_12,genesis_14,genesis_16`);
});

Then(/^I use launch protocol link to unvote$/, function () {
  cy.visit(`${urls.delegatesVote}?unvotes=genesis_12`);
});

Then(/^I use launch protocol link to vote for already voted$/, function () {
  cy.visit(`${urls.delegatesVote}?votes=genesis_14,genesis_16`);
});

Then(/^I see (\d+) already voted$/, function (number) {
  cy.get(ss.alreadyVotedPreselection).should('have.length', number);
});

