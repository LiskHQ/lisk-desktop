/* eslint-disable */
import { ss, urls } from '../../../constants';
import mockBlockchainApplications from '../../../fixtures/blockchainApplications';
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import moment from 'moment';

const chainDetails = mockBlockchainApplications[0]

Given(/^I visit blockchain application details link$/, function () {
  cy.visit(`${urls.login}?modal=blockChainApplicationDetails&chainId=${chainDetails.chainID}`);
});

Then(/^blockchain details should be accuratly displayed$/, function () {
  cy.get(ss.blockchainName).eq(0).should('have.text', chainDetails.name);
  cy.get(ss.lastCertHeightDisplay).eq(0).should('have.text', chainDetails.lastCertificateHeight);
  cy.get(ss.chainStatusDisplay).eq(0).should('have.text', chainDetails.state);
  cy.get(ss.chainOwnerAddress).eq(0).should('have.text', chainDetails.address);
  cy.get(ss.lastChainUpdateDisplay).eq(0).should('have.text', moment(chainDetails.lastUpdated).format('DD MMM YYYY'));
});

Then(/^blockchain details should not be displayed$/, function () {
  cy.get(ss.blockchainName).should('not.exist');
  cy.get(ss.lastCertHeightDisplay).should('not.exist');
  cy.get(ss.chainStatusDisplay).should('not.exist');
  cy.get(ss.chainOwnerAddress).should('not.exist');
  cy.get(ss.lastChainUpdateDisplay).should('not.exist');
});

