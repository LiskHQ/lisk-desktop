import ss from '../../constants/selectors';
import accounts from '../../constants/accounts';
import urls from '../../constants/urls';
import networks from '../../constants/networks';

describe('Extra', () => {
  it('Page not found page', () => {
    cy.visit('/sdk');
    cy.get(ss.app).contains('Page not found.');
  });

  // TODO unskip after fix 1901
  it('Navigation buttons', () => {
    cy.addObjectToLocalStorage('settings', 'advancedMode', true);
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.dashboard);
    cy.get(ss.navigationBtnBack).should('be.disabled');
    cy.get(ss.navigationBtnForward).should('be.disabled');
    cy.get(ss.topBarMenuWalletBtn).click();
    cy.get(ss.transactionRow).eq(1).click();
    cy.get(ss.txSenderAddress).click();
    cy.get(ss.sidebarMenuDelegatesBtn).click();
    cy.wait(1000);
    cy.get(ss.navigationBtnBack).click();
    cy.get(ss.app).contains('My Wallet Details');
    cy.wait(1000);
    cy.get(ss.navigationBtnForward).click();
    cy.get(ss.app).contains('Delegate List');
    cy.wait(1000);
    cy.get(ss.navigationBtnBack).click();
    cy.wait(1000);
    cy.get(ss.navigationBtnBack).click();
    cy.get(ss.app).contains('Copy transaction link');
    cy.wait(1000);
    cy.get(ss.navigationBtnBack).click();
    cy.get(ss.app).contains('My Wallet Details');
    cy.wait(1000);
    cy.get(ss.navigationBtnBack).click();
    cy.get(ss.app).contains('News');
  });
});
