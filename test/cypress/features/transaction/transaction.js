/* eslint-disable */
import { When } from 'cypress-cucumber-preprocessor/steps';
import { ss } from '../../../constants';

When(/^I select ([^\s]+) in ([^\s]+) field$/, function (value, field) {
  cy.get(ss[field]).click()
  cy.get('.options').contains(value).click();
});
