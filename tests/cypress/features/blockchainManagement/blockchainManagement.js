/* eslint-disable */
import moment from 'moment';
import { ss, urls } from '../../../constants';
import mockBlockchainApplications from '../../../fixtures/blockchainApplicationsManage';
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

const blockchainApplication= mockBlockchainApplications[4]

Given(/^I visit the remove blockchain application page$/, function () {
  cy.visit(`${urls.login}?modal=removeApplicationFlow&chainId=${blockchainApplication.chainID}`);
});

Then(/^remove blockchain details should be accurately displayed$/, function () {
  cy.get(ss.blockchainName).eq(0).should('have.text', blockchainApplication.name);
  cy.get(ss.lastCertHeightDisplay).eq(0).should('have.text', blockchainApplication.lastCertificateHeight);
  cy.get(ss.chainStatusDisplay).eq(0).should('have.text', blockchainApplication.state);
  cy.get(ss.chainOwnerAddress).eq(0).should('have.text', blockchainApplication.address);
  cy.get(ss.lastChainUpdateDisplay).eq(0).should('have.text', moment(blockchainApplication.lastUpdated).format('DD MMM YYYY'));
});

Then(/^application removal success page should show$/, function () {
  cy.get(`.remove-app-success-wrapper > p`).eq(0).should('contain.text', 'Application has now been removed');
  cy.get(`.remove-app-success-wrapper > p`).eq(1).should('contain.text', 'You can always add Kalipo again to your application list.');
});

Then(/^I should see the dashboard$/, function () {
  cy.hash().should('eq', '#/dashboard');
});

Then(/^current application name should be: (.+)$/, function (applicationName) {
  cy.get(ss.managedAppDropdown).eq(0).should('contain.text', applicationName);
});

When(/^I trigger remove application on chain: (.+)$/, function (applicationName) {

  cy.get(ss.managedApplicationRow).then(eles => {
    eles.each( (index, ele) => {
      if(ele.innerText === applicationName){
        cy.get(`${ss.managedApplicationRow}:nth-of-type(${index + 1}) ${ss.removeApplicationButton}`).click({force: true})
        return;
      }
    })
  })
});

