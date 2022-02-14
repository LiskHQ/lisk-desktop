/* eslint-disable */
import { Then } from 'cypress-cucumber-preprocessor/steps';
import ss from '../../../constants/selectors';

When(/^I paste (.+) in ([\w]+) field$/, function (value, field) {
  cy.get(ss[field]).clear().invoke('val', value.slice(0, value.length - 1)).type(value.slice(-1))
});