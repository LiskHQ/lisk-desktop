/* eslint-disable */
import { Then } from 'cypress-cucumber-preprocessor/steps';
import ss from '../../../constants/selectors';

Then(/^the modal should show the signature is (.*?)$/, function (message) {
    cy.get(ss.verifyMessage).eq(0).should('contain', message);
  });