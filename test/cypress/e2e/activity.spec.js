import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import ss from '../../constants/selectors';
import urls from '../../constants/urls';


/**
 * To remove the effect of activating the All tab back after full load
 */
const waitBeforeChangeTabAfterLoading = () => cy.wait(2000); // TODO Update when #1400 is done

describe('Dashboard Activity', () => {
  describe('Latest activity', () => {
    beforeEach(() => {
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    });
    /**
     * 5 transaction are shown in the latest activity component
     * @expect 5 transactions
     */
    it('5 tx are shown', () => {
      cy.visit(urls.dashboard);
      cy.get(ss.transactionRow).should('have.length', 5);
    });

    /**
     * Click on transaction row leads to tx details page
     * @expect url
     * @expect some specific to page element is present on it
     */
    it('Click leads to tx details', () => {
      cy.visit(urls.dashboard);
      cy.get(ss.transactionRow).eq(0).click();
      cy.url().should('contain', `${urls.wallet}?id=`);
      cy.get(ss.txDetailsBackButton);
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
      cy.get(ss.recipientInput);
    });
  });

  [
    {
      name: 'Wallet Activity',
      open: () => cy.visit(urls.wallet),
    },
    {
      name: 'Account Activity opened from search',
      open: () => {
        cy.get(ss.searchInput).click().type(`${accounts.genesis.address}{enter}`);
      },
    },
  ].forEach((testSet) => {
    describe(testSet.name, () => {
      /**
       * Scrolling down triggers loading another portion of txs
       * @expect more txs are present
       */
      it('25 tx are shown, scrolling loads another 25', () => {
        cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
        testSet.open();
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
        testSet.open();
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
      it('Filtering works', () => {
        cy.autologin(accounts['second passphrase account'].passphrase, networks.devnet.node);
        testSet.open();
        cy.get(ss.transactionRow).should('have.length', 2);
        cy.get(ss.filterIncoming).click();
        cy.get(ss.transactionRow).should('have.length', 1);
        cy.get(ss.transactionRow).eq(0)
          .find(ss.transactionAddress).contains(accounts.genesis.address);
        cy.get(ss.filterOutgoing).click();
        cy.get(ss.transactionRow).should('have.length', 1);
        cy.get(ss.transactionRow).eq(0)
          .find(ss.transactionAddress).contains('Second passphrase registration');
        cy.get(ss.filterAll).click();
        cy.get(ss.transactionRow).should('have.length', 2);
      });

      describe('Account info tabs', () => {
        beforeEach(() => {
          cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
          testSet.open();
          waitBeforeChangeTabAfterLoading();
          cy.get(ss.accountInfoTab).click();
        });
        /**
         * Maximum possible number of voted accounts is shown
         * @expect 101 are shown
         */
        it('Shows 101 votes', () => {
          cy.get(ss.showMoreVotesBtn).click();
          cy.get(ss.votedAddress).should('have.length', 101);
        });
        /**
         * Shows voted delegate's nickname, not address
         * @expect delegate's nickname shown
         */
        it('Shows voted delegate nickname ', () => {
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
    });
  });

  [
    {
      name: 'Wallet Activity for delegate',
      open: () => cy.visit(urls.wallet),
    },
    {
      name: 'Account Activity opened from search for delegate',
      open: () => {
        cy.get(ss.searchInput).click().type(`${accounts.delegate.address}{enter}`);
      },
    },
  ].forEach((testSet) => {
    describe(testSet.name, () => {
      beforeEach(() => {
        cy.autologin(accounts.delegate.passphrase, networks.devnet.node);
        testSet.open();
        waitBeforeChangeTabAfterLoading();
        cy.get(ss.delegateStatisticsTab).click();
      });
      describe('Delegate statistics tab', () => {
        /**
         * Shows voted delegate's nickname not addresses
         * @expect delegate's nickname shown
         */
        it('Shows voted delegate nickname ', () => {
          cy.get(ss.votedAddress).eq(0).should('have.text', 'genesis_17 ');
        });

        /**
         * Click on voted delegate leads to account page
         * @expect corresponding delegate name is shown on account's page
         */
        it('Click on voted delegate leads to account page', () => {
          cy.get(ss.votedAddress).eq(0).click();
          cy.get(ss.delegateName).should('have.text', 'genesis_17');
        });


        // TODO Fix after corresponding bugfix
        /**
         * Shows nickname of account on "Who voted for this delegate?"
         * list if the account is a delegate
         * @expect voters nickname shown
         */
        xit('Shows voters nickname if it is delegate', () => {
          cy.get(ss.voterAdress).eq(0).should('have.text', 'genesis_1 ');
        });

        /**
         * Shows address of account on "Who voted for this delegate?"
         * list if the account is not a delegate
         * @expect voters address shown
         */
        it('Shows voters address if it is not delegate', () => {
          cy.get(ss.voterAdress).eq(1).should('have.text', '16313739661670634666L ');
        });

        /**
         * Click on voter leads to account page
         * @expect according delegate name is shown on account's page
         */
        it('Click on voter leads to account page', () => {
          cy.get(ss.voterAdress).eq(1).click();
          cy.get(ss.leftBlockAccountExplorer).find(ss.accountAddress).should('have.text', '16313739661670634666L');
        });
      });
    });
  });
});
