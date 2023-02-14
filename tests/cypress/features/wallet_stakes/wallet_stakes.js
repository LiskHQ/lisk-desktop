/* eslint-disable */
import { Then } from 'cypress-cucumber-preprocessor/steps';
import { ss } from '../../../constants';

Then(/^I open stakes tab$/, function () {
  cy.get(ss.stakesTab).click();
});

Then(/^I see 30 validators$/, function () {
  cy.get(ss.stakeRow).should('have.length', 30);
});

Then(/^I click show more$/, function () {
  cy.get(ss.showMoreStakesBtn).click();
});

Then(/^I see more than 30 stakes$/, function () {
  cy.get(ss.stakeRow).should('have.length.greaterThan', 30);
});

Then(/^I see no stakes$/, function () {
  cy.get(ss.stakeRow).should('not.exist');
});

Then(/^I filter stakes$/, function () {
  cy.get(ss.searchValidatorInput).click().type('genesis_17');
});

Then(/^I should see (\d+) validators in table$/, function (number) {
  cy.get(ss.stakeRow).should('have.length', number);
});
