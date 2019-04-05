import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import ss from '../../constants/selectors';
import urls from '../../constants/urls';

describe('Latest activity', () => {
  beforeEach(() => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.dashboard);
  });
  /**
   * 4 transaction are shown in the latest activity component
   * @expect 4 transactions visible
   */
  it('4 tx are shown by default', () => {
    cy.get(ss.transactionRow).eq(4).should('be.visible');
    cy.get(ss.transactionRow).eq(30).should('not.be.visible');
  });

  /**
   * 30 transaction are shown in the latest activity component after clicking Show more
   * @expect 30 transactions visible
   */
  it('30 tx are shown after Show More click', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.transactionRow).should('have.length', 30);
    cy.get(ss.showMoreButton).eq(0).click();
    cy.get(ss.transactionRow).eq(4).should('be.visible');
    cy.get(ss.transactionRow).eq(29).trigger('mouseover').should('be.visible');
  });

  /**
   * Click on transaction row leads to tx details page
   * @expect url
   * @expect some specific to page element is present on it
   */
  it('Click leads to tx details', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.transactionRow).eq(0).click();
    cy.get(ss.txSenderAddress).should('be.visible');
  });

  /**
   * 'See all transactions' link leads to wallet page
   * @expect url
   * @expect some specific to page element is present on it
   */
  it('See all leads to wallet activity', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.seeAllTxsBtn).click();
    cy.url().should('contain', `${urls.wallet}`);
    cy.get(ss.transactionRequestButton);
  });
});

describe('Transactions', () => {
  /**
   * Clicking show more button triggers loading another portion of txs
   * @expect more txs are present
   */
  it('30 tx are shown, clicking show more loads more transactions', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.transactionRow).should('have.length', 30);
    cy.get(ss.showMoreButton).click();
    cy.get(ss.transactionRow).should('have.length.greaterThan', 30);
  });

  /**
   * Click on transaction row leads to tx details page
   * @expect url
   * @expect some specific to page element is present on it
   */
  it('Click leads to tx details', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.transactionRow).eq(0).click();
    cy.url().should('contain', urls.transactions);
  });

  /**
   * Transaction tabs show filtered transaction lists
   * @expect incoming txs on Incoming tab
   * @expect outgoing txs on Outgoing tab
   * @expect all txs on All tab
   */
  it('Incoming/Outgoing/All filtering works', () => {
    cy.autologin(accounts['second passphrase account'].passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.transactionRow).should('have.length', 2);
    cy.get(ss.filterIncoming).click();
    cy.get(ss.transactionRow).should('have.length', 1);
    cy.get(ss.transactionRow).eq(0)
      .find(ss.transactionAddress).contains(accounts.genesis.address);
    cy.get(ss.filterAll).click();
    cy.get(ss.transactionRow).should('have.length', 2);
    cy.get(ss.filterOutgoing).click();
    cy.get(ss.transactionRow).should('have.length', 1);
    cy.get(ss.transactionRow).eq(0)
      .find(ss.transactionAddress).contains('Second passphrase registration');
  });
});

describe('Transaction list filtering', () => {
  beforeEach(() => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.filterTransactionsBtn).click();
  });

  it('Filter by 2 Dates, clear 1 filter to filter by 1 Date', () => {
    cy.get(ss.dateFromInputFilter).type('25.05.16');
    cy.get(ss.dateToInputFilter).type('26.05.16');
    cy.get(ss.applyFilters).click();
    cy.get(ss.transactionRow).should('have.length', 0);
    cy.get(ss.filter).contains('25').parent().find(ss.clearFilterBtn)
      .click();
    cy.get(ss.transactionRow).should('have.length', 2);
  });

  it('Date validation error', () => {
    cy.get(ss.dateFromInputFilter).type('45.43.54');
    cy.get(ss.filterDropdown).contains('Date must be in DD.MM.YY format');
    cy.get(ss.applyFilters).should('be.disabled');
  });

  it('Filter by 1 Amount, add second filter by 1 Amount', () => {
    cy.get(ss.amountFromInputFilter).type('4800');
    cy.get(ss.applyFilters).click();
    cy.get(ss.transactionRow).should('have.length', 4);
    cy.get(ss.filterTransactionsBtn).click();
    cy.get(ss.amountToInputFilter).type('4900');
    cy.get(ss.applyFilters).click();
    cy.get(ss.transactionRow).should('have.length', 2);
  });

  it('Amount validation error', () => {
    cy.get(ss.amountFromInputFilter).type('2');
    cy.get(ss.amountToInputFilter).type('1');
    cy.get(ss.filterDropdown).contains('Max amount must be greater than Min amount');
    cy.get(ss.applyFilters).should('be.disabled');
  });

  it.skip('Filter by Message', () => {
    cy.get(ss.messageInputFilter).type('without-initialization');
    cy.get(ss.applyFilters).click();
    cy.get(ss.transactionRow).should('have.length', 1);
  });

  it('Message validation error', () => {
    cy.get(ss.messageInputFilter).type(new Array(66).join('a'));
    cy.get(ss.filterDropdown).contains('Maximum length exceeded');
    cy.get(ss.applyFilters).should('be.disabled');
  });

  it.skip('Filter by all filters combined, clear all filters', () => {
    cy.get(ss.dateFromInputFilter).type('03.04.19');
    cy.get(ss.dateToInputFilter).type('03.04.19');
    cy.get(ss.amountFromInputFilter).type('80');
    cy.get(ss.amountToInputFilter).type('80');
    cy.get(ss.messageInputFilter).type('second');
    cy.get(ss.applyFilters).click();
    cy.get(ss.transactionRow).should('have.length', 1);
    cy.get(ss.clearAllFiltersBtn).click();
    cy.get(ss.transactionRow).should('have.length', 30);
  });

  it('Incoming/Outgoing applies to filter results', () => {
    cy.get(ss.amountFromInputFilter).type('4900');
    cy.get(ss.applyFilters).click();
    cy.get(ss.transactionRow).should('have.length', 3);
    cy.get(ss.filterIncoming).click();
    cy.get(ss.transactionRow).should('have.length', 1);
    cy.get(ss.filterOutgoing).click();
    cy.get(ss.transactionRow).should('have.length', 2);
  });
});
