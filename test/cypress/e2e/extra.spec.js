import ss from '../../constants/selectors';
import accounts from '../../constants/accounts';
import urls from '../../constants/urls';
import networks from '../../constants/networks';

describe('Extra', () => {
  it('Page not found page', () => {
    cy.visit('/sdk');
    cy.get(ss.app).contains('Page not found.');
  });

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
    cy.get(ss.navigationBtnBack).click();
    cy.get(ss.app).contains('My Wallet Details');
    cy.get(ss.navigationBtnForward).click();
    cy.get(ss.app).contains('Delegate List');
    cy.get(ss.navigationBtnBack).click();
    cy.get(ss.navigationBtnBack).click();
    cy.get(ss.app).contains('Copy link');
    cy.get(ss.navigationBtnBack).click();
    cy.get(ss.app).contains('My Wallet Details');
    cy.get(ss.navigationBtnBack).click();
    cy.get(ss.app).contains('News');
  });
});
