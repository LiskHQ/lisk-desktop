import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import ss from '../../constants/selectors';
import urls from '../../constants/urls';

function testActivity(open) {
  /**
   * Clicking show more button triggers loading another portion of txs
   * @expect more txs are present
   */
  it('30 tx are shown, clicking show more loads more transactions', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.dashboard);
    open();
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
    open();
    cy.get(ss.transactionRow).eq(0).click();
    cy.url().should('contain', urls.transactions);
  });

  /**
   * Transaction filtering tabs show filtered transaction lists
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

  describe('Account info tab', () => {
    beforeEach(() => {
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      open();
      cy.get(ss.accountInfoTab).click();
    });

    /**
     * Delegate statistics tab is not present for not-delegate
     */
    it('No delegate statistics tab is present', () => {
      cy.get(ss.delegateStatisticsTab).should('not.exist');
    });

    /**
     * Maximum possible number of voted accounts is shown
     * @expect more votes are present
   */
    it('30 votes are shown, clicking show more loads more votes', () => {
      cy.get(ss.voteRow).should('have.length', 30);
      cy.get(ss.showMoreVotesBtn).click();
      cy.get(ss.voteRow).should('have.length.greaterThan', 30);
    });

    it('Filtering votes works', () => {
      cy.get(ss.searchDelegateInput).click().type('genesis_17');
      cy.get(ss.voteRow).should('have.length', 1);
    });

    /**
     * Click on voted delegate leads to account page
     * @expect corresponding delegate name is shown on account's page
     */
    it('Click on voted delegate leads to account page', () => {
      cy.get(ss.searchDelegateInput).click().type('genesis_17');
      cy.get(ss.voteRow).eq(0).click();
      cy.get(ss.accountName).should('have.text', 'genesis_17');
    });
  });
}

function testDelegateActivity(open) {
  beforeEach(() => {
    cy.autologin(accounts.delegate.passphrase, networks.devnet.node);
    open();
    cy.get(ss.delegateStatisticsTab).click();
  });
  describe('Delegate statistics tab', () => {
    // TODO Unskip after corresponding bugfix
    /**
     * Shows nickname of account on "Who voted for this delegate?"
     * list if the account is a delegate
     * @expect voters nickname shown
     */
    xit('Shows voters nickname if it is delegate', () => {
      cy.get(ss.voterAddress).eq(0).should('have.text', 'genesis_1 ');
    });

    it('Shows statistics', () => {
      cy.get(ss.delegateStatsUptime).contains('100%');
      cy.get(ss.delegateStatsUptime).contains('1');
      cy.get(ss.delegateStatsApproval).contains('100%');
      cy.get(ss.delegateStatsWeight).contains('100,000,000');
      cy.get(ss.delegateStatsForged).contains('0');
      cy.get(ss.delegateStatsBlocks).contains(/\d/);
      cy.get(ss.delegateStatsSince).contains(/\d{2}\s\w{3}\s\d{2}/);
      cy.get(ss.delegateStatsLastBlock).contains(/\d{2}\s\w{3}\s\d{2}/);
    });
  });
}

function testWalletV2(open, account) {
  /**
   * Clicking show more button triggers loading another portion of txs
   * @expect more txs are present
   */
  it('30 tx are shown, clicking show more loads more transactions', () => {
    cy.autologin(account.passphrase, networks.devnet.node);
    open();
    cy.get(ss.transactionRow).should('have.length', 30);
    cy.get(ss.showMoreButton).click();
    cy.get(ss.transactionRow).should('have.length.greaterThan', 30);
  });

  /**
   * Click on transaction row leads to tx details page
   * @expect url
   */
  it('Click leads to tx details', () => {
    cy.autologin(account.passphrase, networks.devnet.node);
    open();
    cy.get(ss.transactionRow).eq(0).click();
    cy.url().should('contain', urls.transactions);
  });

  /**
   * Transaction filtering tabs show filtered transaction lists
   * @expect incoming txs on Incoming tab
   * @expect outgoing txs on Outgoing tab
   * @expect all txs on All tab
   */
  it('Incoming/Outgoing/All filtering works', () => {
    cy.autologin(accounts['second passphrase account'].passphrase, networks.devnet.node);
    open();
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
}

describe('Latest activity', () => {
  beforeEach(() => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
  });
  /**
   * 4 transaction are shown in the latest activity component
   * @expect 4 transactions visible
   */
  it('4 tx are shown by default', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.transactionRow).eq(4).should('be.visible');
    cy.get(ss.transactionRow).eq(30).should('be.not.visible');
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
    cy.url().should('contain', urls.transactions);
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

describe('Wallet activity', () => {
  testWalletV2(() => cy.visit(urls.wallet), accounts.genesis);
});

describe('Account Activity opened from search', () => {
  testActivity(() => cy.get(ss.searchInput).click().type(`${accounts.genesis.address}{enter}`));
});

describe('Wallet Activity for delegate', () => {
  testWalletV2(() => cy.visit(urls.wallet), accounts.delegate);
});

describe('Account Activity opened from search for delegate', () => {
  testDelegateActivity(() => cy.get(ss.searchInput).click().type(`${accounts.delegate.address}{enter}`));
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

  it('Filter by Message', () => {
    cy.get(ss.messageInputFilter).type('without-initialization');
    cy.get(ss.applyFilters).click();
    cy.get(ss.transactionRow).should('have.length', 1);
  });

  it('Message validation error', () => {
    cy.get(ss.messageInputFilter).type(new Array(66).join('a'));
    cy.get(ss.filterDropdown).contains('Maximum length exceeded');
    cy.get(ss.applyFilters).should('be.disabled');
  });

  it('Filter by all filters combined, clear all filters', () => {
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
