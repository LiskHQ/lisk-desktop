import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';

const getFollowedAccountObjFromLS = () => JSON.parse(localStorage.getItem('followedAccounts'));
const checkAccountsPageIsLoaded = () => cy.get(ss.transactionSendButton);

describe('Wallet', () => {
  describe('My Account', () => {
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

    it('Shows Address and Label', () => {
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit(urls.wallet);
      cy.get(ss.accountAddress).contains(accounts.genesis.address);
      cy.get(ss.accountName).contains('Account');
      cy.get(ss.accountLabel).contains('My Account');
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

  describe('Others account', () => {
    const topDelegate = {
      address: '2581762640681118072L',
      username: 'genesis_51',
    };
    it('Delegate -> Address, Name & Label are correct', () => {
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit(`${urls.accounts}/${topDelegate.address}`);
      cy.url().should('contain', topDelegate.address);
      cy.get(ss.accountAddress).contains(topDelegate.address);
      cy.get(ss.accountName).contains(topDelegate.username);
      cy.get(ss.accountLabel).contains('Delegate #1');
    });

    it('Not delegate -> Address, Name & Label are correct', () => {
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit(`${urls.accounts}/${accounts['empty account'].address}`);
      cy.get(ss.accountAddress).contains(accounts['empty account'].address);
      cy.get(ss.accountName).contains('Account');
      cy.get(ss.accountLabel).should('not.exist');
    });

    it('Bookmarked account -> Address, Name & Label are correct', () => {
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit(urls.dashboard);
      cy.get(ss.addFollowerAccountButton).click();
      cy.get(ss.addressInput).click().type(accounts['empty account'].address);
      cy.get(ss.nextBtn).click();
      cy.get(ss.titleInput).type('Alice');
      cy.get(ss.nextBtn).click();
      cy.visit(`${urls.accounts}/${accounts['empty account'].address}`);
      cy.get(ss.accountAddress).contains(accounts['empty account'].address);
      cy.get(ss.accountName).contains('Alice');
      cy.get(ss.accountLabel).contains('Followed Account');
    });

    it('Send LSK to this account', () => {
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit(urls.dashboard);
      cy.visit(`${urls.accounts}/${accounts.delegate.address}`);
      cy.get(ss.sendToThisAccountBtn).click();
      cy.url().should('contain', urls.send);
      cy.get(ss.recipientInput).should('have.value', accounts.delegate.address);
    });

    it('Add / Remove bookmark', () => {
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit(urls.dashboard);
      cy.visit(`${urls.accounts}/${accounts.genesis.address}`);
      cy.get(ss.followAccountBtn).contains('Bookmark account');
      cy.get(ss.followAccountBtn).click();
      cy.get(ss.titleInput).type('Bob');
      cy.get(ss.confirmAddToBookmarks).click()
        .should(() => {
          expect(getFollowedAccountObjFromLS()[0].address).to.equal(accounts.genesis.address);
          expect(getFollowedAccountObjFromLS()[0].title).to.equal('Bob');
        });
      cy.reload();
      cy.get(ss.accountName).contains('Bob');
      cy.get(ss.followAccountBtn).contains('Account bookmarked');
      cy.get(ss.followAccountBtn).click();
      cy.get(ss.confirmAddToBookmarks).click()
        .should(() => {
          expect(getFollowedAccountObjFromLS().length).to.equal(0);
        });
      cy.get(ss.accountName).contains('Account');
    });

    it('Cant change bookmark name for bookmarked delegate', () => {
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit(urls.dashboard);
      cy.visit(`${urls.accounts}/${accounts.delegate.address}`);
      cy.get(ss.followAccountBtn).contains('Bookmark account');
      cy.get(ss.followAccountBtn).click();
      cy.get(ss.titleInput).type('Bob');
      cy.get(ss.titleInput).should('have.value', accounts.delegate.username);
    });
  });

  describe.skip('Wallet overview', () => {
  });

  describe('Votes tab', () => {
    beforeEach(() => {
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit(urls.wallet);
      cy.get(ss.votesTab).click();
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
      cy.get(ss.voteRow).eq(0).click();
      cy.get(ss.accountName).contains('genesis');
    });
  });

  describe('Delegate tab', () => {
    it('Shows delegate statistics for himself', () => {
      cy.autologin(accounts.delegate.passphrase, networks.devnet.node);
      cy.visit(urls.wallet);
      cy.get(ss.delegateStatisticsTab).click();
      cy.get(ss.delegateStatsRank).contains(/\d/);
      cy.get(ss.delegateStatsUptime).contains(/\d%/);
      cy.get(ss.delegateStatsApproval).contains(/\d%/);
      cy.get(ss.delegateStatsWeight).contains(/\d LSK/);
      cy.get(ss.delegateStatsForged).contains(/\d LSK/);
      cy.get(ss.delegateStatsBlocks).contains(/\d/);
      cy.get(ss.delegateStatsSince).contains(/\d{2}\s\w{3}\s\d{2}/);
      cy.get(ss.delegateStatsLastBlock).contains(/\d{2}\s\w{3}\s\d{2}/);
    });

    it('Shows delegate statistics for other', () => {
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit(`${urls.accounts}/${accounts.delegate.address}`);
      cy.get(ss.delegateStatisticsTab).should('be.visible');
      cy.get(ss.delegateStatisticsTab).click();
      cy.get(ss.delegateStatsUptime).contains(/\d%/);
    });

    it('Not there for non-delegate himself', () => {
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit(urls.wallet);
      cy.get(ss.delegateStatisticsTab).should('not.exist');
    });

    it('Not there for non-delegate for other', () => {
      cy.autologin(accounts.delegate.passphrase, networks.devnet.node);
      cy.visit(`${urls.accounts}/${accounts.genesis.address}`);
      cy.get(ss.delegateStatisticsTab).should('not.exist');
    });
  });
});

