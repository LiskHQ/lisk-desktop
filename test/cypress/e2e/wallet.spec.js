import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';

describe('Wallet', () => {
  /**
   * Wallet page can be opened by direct link
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  it(`Wallet page opens by url ${urls.wallet}`, () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.url().should('contain', urls.wallet);
    cy.get(ss.transactionSendButton);
  });

  /**
   * On boarding banner shows up if balance is 0 and localStorage.closedWalletOnboarding not set
   * @expect balance is 0
   * @expect On boarding banner is present on it
   * @expect After clicking close doesn't show banner again
   */
  it('Wallet page shows onboarding banner', () => {
    cy.autologin(accounts['empty account'].passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.walletOnboarding).should('exist');
    cy.get(ss.walletOnboardingClose).click();
    cy.reload();
    cy.get(ss.walletOnboarding).should('not.exist');
  });

  /**
   * Sidebar link leads to Wallet page
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  it('Wallet page opens by sidebar button', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.dashboard);
    cy.get(ss.sidebarMenuWalletBtn).should('have.css', 'opacity', '1').click();
    cy.url().should('contain', urls.wallet);
    cy.get(ss.transactionSendButton);
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
