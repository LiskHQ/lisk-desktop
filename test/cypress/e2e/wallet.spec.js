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

describe('Transaction list filtering', () => {
  it('Filter by 2 Dates, clear 1 filter to filter by 1 Date', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.filterTransactionsBtn).click();
    cy.get(ss.dateFromInputFilter).type('25.05.16');
    cy.get(ss.dateToInputFilter).type('26.05.16');
    cy.get(ss.applyFilters).click();
    cy.get(ss.transactionRow).should('have.length', 0);
    cy.get(ss.filter).contains('25').parent().find(ss.clearFilterBtn)
      .click();
    cy.get(ss.transactionRow).should('have.length', 2);
  });

  it('Date validation error', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.filterTransactionsBtn).click();
    cy.get(ss.dateFromInputFilter).type('45.43.54');
    cy.get(ss.filterDropdown).contains('Date must be in DD.MM.YY format');
    cy.get(ss.applyFilters).should('be.disabled');
  });

  it('Filter by 1 Amount, add second filter by 1 Amount', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.filterTransactionsBtn).click();
    cy.get(ss.amountFromInputFilter).type('4800');
    cy.get(ss.applyFilters).click();
    cy.get(ss.transactionRow).should('have.length', 4);
    cy.get(ss.filterTransactionsBtn).click();
    cy.get(ss.amountToInputFilter).type('4900');
    cy.get(ss.applyFilters).click();
    cy.get(ss.transactionRow).should('have.length', 2);
  });

  it('Amount validation error', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.filterTransactionsBtn).click();
    cy.get(ss.amountFromInputFilter).type('2');
    cy.get(ss.amountToInputFilter).type('1');
    cy.get(ss.filterDropdown).contains('Max amount must be greater than Min amount');
    cy.get(ss.applyFilters).should('be.disabled');
  });

  it('Filter by Message', () => {
    cy.get(ss.filterTransactionsBtn).click();
    cy.get(ss.messageInputFilter).type('without-initialization');
    cy.get(ss.applyFilters).click();
    cy.get(ss.transactionRow).should('have.length', 1);
  });

  it('Message validation error', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.filterTransactionsBtn).click();
    cy.get(ss.messageInputFilter).type(new Array(66).join('a'));
    cy.get(ss.filterDropdown).contains('Maximum length exceeded');
    cy.get(ss.applyFilters).should('be.disabled');
  });

  xit('Filter by all filters combined, clear all filters', () => {
    cy.get(ss.filterTransactionsBtn).click();
    cy.get(ss.dateFromInputFilter).type('01.04.19');
    cy.get(ss.dateToInputFilter).type('01.04.19');
    cy.get(ss.amountFromInputFilter).type('80');
    cy.get(ss.amountToInputFilter).type('80');
    cy.get(ss.messageInputFilter).type('second');
    cy.get(ss.applyFilters).click();
    cy.get(ss.transactionRow).should('have.length', 1);
  });

  it('Incoming/Outgoing applies to filter results', () => {
  });
});
