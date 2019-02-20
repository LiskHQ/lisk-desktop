import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import ss from '../../constants/selectors';
import urls from '../../constants/urls';


/**
 * To remove the effect of activating the All tab back after full load
 */
const waitBeforeChangeTabAfterLoading = () => cy.wait(2000); // TODO Update when #1400 is done

function testActivity(open) {
  /**
   * Scrolling down triggers loading another portion of txs
   * @expect more txs are present
   */
  it('25 tx are shown, scrolling loads another 25', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    open();
    cy.get(ss.transactionRow).should('have.length', 25);
    cy.get(ss.transactoinsTable).scrollTo('bottom');
    cy.get(ss.transactionRow).should('have.length', 50);
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
    cy.url().should('contain', '?id=');
    cy.get(ss.txDetailsBackButton);
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
    cy.get(ss.termsOfUse).click();
    cy.reload();
    cy.visit('/wallet');
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
      waitBeforeChangeTabAfterLoading();
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
     * @expect 101 are shown
     */
    it('Shows 101 votes', () => {
      cy.get(ss.showMoreVotesBtn).click();
      cy.get(ss.votedAddress).should('have.length', 101);
    });

    it('Filtering votes works', () => {
      cy.get(ss.searchDelegateInput).click().type('genesis_17');
      cy.get(ss.votedAddress).should('have.length', 1);
    });
    /**
     * Shows voted delegate's nickname, not address
     * @expect delegate's nickname shown
     */
    it('Shows voted delegate nickname instead of address', () => {
      cy.get(ss.votedAddress).eq(0).should('have.text', 'genesis_1 ');
    });

    /**
     * Click on voted delegate leads to account page
     * @expect corresponding delegate name is shown on account's page
     */
    it('Click on voted delegate leads to account page', () => {
      cy.get(ss.votedAddress).eq(0).click();
      cy.get(ss.delegateName).should('have.text', 'genesis_1');
    });
  });
}

function testDelegateActivity(open) {
  beforeEach(() => {
    cy.autologin(accounts.delegate.passphrase, networks.devnet.node);
    open();
    waitBeforeChangeTabAfterLoading();
    cy.get(ss.delegateStatisticsTab).click();
  });
  describe('Delegate statistics tab', () => {
    /**
     * Account info tab is not present for delegate
     */
    it('No account info tab is present', () => {
      cy.get(ss.accountInfoTab).should('not.exist');
    });
    /**
     * Shows voted delegate's nickname not addresses
     * @expect delegate's nickname shown
     */
    it('Shows voted delegate nickname instead of address', () => {
      cy.get(ss.votedAddress).eq(0).should('have.text', 'genesis_17 ');
    });

    it('Filtering votes works', () => {
      cy.get(ss.searchDelegateInput).click().type('genesis_17');
      cy.get(ss.votedAddress).should('have.length', 1);
    });

    /**
     * Click on voted delegate leads to account page
     * @expect corresponding delegate name is shown on account's page
     */
    it('Click on voted delegate leads to account page', () => {
      cy.get(ss.votedAddress).eq(0).click();
      cy.get(ss.delegateName).should('have.text', 'genesis_17');
    });


    // TODO Unskip after corresponding bugfix
    /**
     * Shows nickname of account on "Who voted for this delegate?"
     * list if the account is a delegate
     * @expect voters nickname shown
     */
    xit('Shows voters nickname if it is delegate', () => {
      cy.get(ss.voterAddress).eq(0).should('have.text', 'genesis_1 ');
    });

    /**
     * Shows address of account on "Who voted for this delegate?"
     * list if the account is not a delegate
     * @expect voters address shown
     */
    it('Shows voters address if it is not delegate', () => {
      cy.get(ss.voterAddress).eq(1).should('have.text', '16313739661670634666L ');
    });

    /**
     * Click on voter leads to account page
     * @expect according delegate name is shown on account's page
     */
    it('Click on voter leads to account page', () => {
      cy.get(ss.voterAddress).eq(1).click();
      cy.get(ss.leftBlockAccountExplorer).find(ss.accountAddress).should('have.text', '16313739661670634666L');
    });

    it('Shows statistics', () => {
      cy.get(ss.delegateStatsUptime).contains('100%');
      cy.get(ss.delegateStatsUptime).contains('1');
      cy.get(ss.delegateStatsApproval).contains('100%');
      cy.get(ss.delegateStatsWeight).contains('100,000,000');
      cy.get(ss.delegateStatsForged).contains('0');
      cy.get(ss.delegateStatsBlocks).contains(/\d/);
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
    cy.get(ss.termsOfUse).click();
    cy.reload();
    cy.visit('/dashboard');
    cy.get(ss.transactionRow).should('have.length', 30);
    cy.get(ss.showMoreButton).click();
    cy.get(ss.transactionRow).should('have.length.greaterThan', 25);
  });

  /**
   * Click on transaction row leads to tx details page
   * @expect url
   */
  it('Click leads to tx details', () => {
    cy.autologin(account.passphrase, networks.devnet.node);
    open();
    cy.get(ss.termsOfUse).click();
    cy.reload();
    cy.visit('/dashboard');
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
    cy.get(ss.termsOfUse).click();
    cy.reload();
    cy.visit('/wallet');
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

describe.skip('Wallet Activity for delegate', () => {
  testWalletV2(() => cy.visit(urls.wallet), accounts.delegate);
});

describe('Account Activity opened from search for delegate', () => {
  testDelegateActivity(() => cy.get(ss.searchInput).click().type(`${accounts.delegate.address}{enter}`));
});

