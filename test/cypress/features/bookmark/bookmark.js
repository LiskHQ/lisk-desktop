/* eslint-disable */
import { Then } from 'cypress-cucumber-preprocessor/steps';
import { ss } from '../../../constants';

Then(/^The bookmarkList should contain (.*?)$/, function (bookmarkLabel) {
  cy.get(ss.bookmarkAccount).eq(0).should('contain', bookmarkLabel);
});
