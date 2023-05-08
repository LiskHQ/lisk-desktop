/* eslint-disable */
import moment from 'moment';
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { ss, urls } from '../../../constants';
import mockBlockchainApplications from '../../../fixtures/blockchainApplicationsManage';
import mockBlockchainApplicationsExplore from '../../../fixtures/blockchainApplicationsExplore';

const blockchainApplication = mockBlockchainApplications[4];
const firstChainDetails = mockBlockchainApplicationsExplore[0];

Given(/^I visit the remove blockchain application page$/, function () {
  cy.visit(`${urls.login}?modal=removeApplicationFlow&chainId=${blockchainApplication.chainID}`);
});

Then(/^remove blockchain details should be accurately displayed$/, function () {
  cy.get(ss.blockchainName).eq(0).should('have.text', blockchainApplication.name);
  cy.get(ss.lastCertHeightDisplay)
    .eq(0)
    .should('have.text', blockchainApplication.lastCertificateHeight);
  cy.get(ss.chainStatusDisplay).eq(0).should('have.text', blockchainApplication.state);
  cy.get(ss.chainOwnerAddress).eq(0).should('have.text', blockchainApplication.address);
  cy.get(ss.lastChainUpdateDisplay)
    .eq(0)
    .should('have.text', moment(blockchainApplication.lastUpdated).format('DD MMM YYYY'));
});

Then(/^application removal success page should show$/, function () {
  cy.get(`.remove-app-success-wrapper > p`)
    .eq(0)
    .should('contain.text', 'Application has now been removed');
  cy.get(`.remove-app-success-wrapper > p`)
    .eq(1)
    .should('contain.text', 'You can always add Kalipo again to your application list.');
});

Then(/^current application name should be: (.+)$/, function (applicationName) {
  cy.get(ss.managedAppDropdown).eq(0).should('contain.text', applicationName);
});

When(/^I trigger remove application on chain: (.+)$/, function (applicationName) {
  cy.get(ss.managedApplicationRow).then((eles) => {
    eles.each((index, ele) => {
      if (ele.innerText === applicationName) {
        cy.get(
          `${ss.managedApplicationRow}:nth-of-type(${index + 1}) ${ss.removeApplicationButton}`
        ).click({ force: true });
        return;
      }
    });
  });
});

Then(/^blockchain details should be accurately displayed$/, function () {
  cy.get(ss.blockchainName).eq(0).should('have.text', firstChainDetails.name);
  cy.get(ss.lastCertHeightDisplay)
    .eq(0)
    .should('have.text', firstChainDetails.lastCertificateHeight);
  cy.get(ss.chainStatusDisplay).eq(0).should('have.text', firstChainDetails.state);
  cy.get(ss.chainOwnerAddress).eq(0).should('have.text', firstChainDetails.address);
  cy.get(ss.lastChainUpdateDisplay)
    .eq(0)
    .should('have.text', moment(firstChainDetails.lastUpdated).format('DD MMM YYYY'));
});

Then(/^I should be on add blockchain application modal$/, function () {
  cy.visit(`${urls.wallet}?modal=addApplicationList`);
  cy.get(ss.addApplicationHeader).should('have.text', 'Add application');
  cy.get(ss.addApplicationTable).should('exist');
});

Then(/^blockchain details should be in add application mode$/, function () {
  cy.url().should('include', 'mode=addApplication');
  cy.get(ss.addApplicationButton).should('be.visible');
});

Then(/^I should be on add blockchain application success modal$/, function () {
  cy.url().should('include', 'chainId=aq02qkbb35u4jdq8szo3pnsq');
  cy.get(ss.addApplicationSuccessHeader).should(
    'have.text',
    'Perfect! Application has now been added'
  );
  cy.get(ss.addApplicationSuccessButton).should('have.text', 'Continue to wallet');
});

Then(/^application list should have (\w+(.*)?)$/, function (applicationName) {
  cy.visit(`${urls.wallet}?modal=manageApplications`);
  cy.get(ss.managedApplicationRow).then((elem) => {
    elem.each((_, el) => {
      if (el.innerText === applicationName) {
        return;
      }
    });
  });
});

When(/^I select application on chain: (.+)$/, function (applicationName) {
  cy.get(ss.managedApplicationRow).then((eles) => {
    eles.each((index, ele) => {
      if (ele.innerText === applicationName) {
        cy.get(`${ss.managedApplicationRow}:nth-of-type(${index + 1})`).click();
        return;
      }
    });
  });
});

Then(/^I should be on add blockchain application select node modal$/, function () {
  cy.url().should('include', 'chainId=aq25derd17a4syc8aet3pryt');
  cy.get(ss.selectApplicationNodeHeader).should('have.text', 'Kalipo');
  cy.get(ss.selectApplicationNodeContent).should('have.text', 'Choose application URL');
  cy.get(`${ss.selectApplicationNodeRow}:first()`).should(
    'have.text',
    'https://service.kalipo.com'
  );
});
