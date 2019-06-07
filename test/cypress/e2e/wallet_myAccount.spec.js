import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';

const checkAccountsPageIsLoaded = () => cy.get(ss.transactionSendButton);

describe('Wallet My Account', () => {
  it(`Opens by url ${urls.wallet}`, () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.url().should('contain', urls.wallet);
    checkAccountsPageIsLoaded();
  });

  it('Opens by topbar button', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.dashboard);
    cy.get(ss.topBarMenuWalletBtn).click();
    cy.url().should('contain', urls.wallet);
    checkAccountsPageIsLoaded();
  });

  /**
     * On boarding banner shows up if balance is 0 and localStorage.closedWalletOnboarding not set
     * @expect balance is 0
     * @expect On boarding banner is present on it
     * @expect After clicking close doesn't show banner again
     */
  it('Shows onboarding banner', () => {
    cy.autologin(accounts['empty account'].passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.walletOnboarding).should('exist');
    cy.get(ss.walletOnboardingClose).click();
    cy.reload();
    cy.get(ss.walletOnboarding).should('not.exist');
  });

  it('Shows Header and Address', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.walletHeader).contains('Lisk Wallet');
    cy.get(ss.accountAddress).contains(accounts.genesis.address);
  });

  it('Send button -> Send page', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.transactionSendButton).click();
    cy.url().should('contain', urls.send);
    cy.get(ss.recipientInput);
  });

  it('Request button -> Request dropdown', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.requestDropdown).should('be.not.visible');
    cy.get(ss.transactionRequestButton).click();
    cy.get(ss.requestDropdown).should('be.visible');
  });
});

