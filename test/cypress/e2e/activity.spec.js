import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';

const ss = {
  transactoinsTable: '.transaction-results',
  transactionRow: '.transactions-row',
  seeAllBtn: '.seeAllLink',
  transactionDetailBackButton: '.transaction-details-back-button',
  recipientInput: '.recipient input',
  accountInfoTab: '.account-info',
  delegateStatisticsTab: '.delegate-statistics ',
  votedAdress: '.votes .voter-address',
  voterAdress: '.voters .voter-address',
  delegateName: '.delegate-name',
  accountAddress: '.copy-title',
  searchInput: '#autosuggest-input',
  showMoreVotesBtn: '.show-votes',
  explorerAccountLeftBlock: '.explorer-account-left-block',
};

/**
 * To remove the effect of activating the All tab back after full load
 */
const waitBeforeChangeTabAfterLoading = () => cy.wait(2000); // TODO Update when #1400 is done

describe('Dashboard Activity', () => {
  describe('Latest activity', () => {
    beforeEach(() => {
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    });
    it('5 tx are shown', () => {
      cy.visit(urls.dashboard);
      cy.get(ss.transactionRow).should('have.length', 5);
    });

    it('Click leads to tx details', () => {
      cy.visit(urls.dashboard);
      cy.get(ss.transactionRow).eq(0).click();
      cy.url().should('contain', 'wallet?id=');
      cy.get(ss.transactionDetailBackButton);
    });

    it('See all leads to wallet activity', () => {
      cy.visit(urls.dashboard);
      cy.get(ss.seeAllBtn).click();
      cy.url().should('contain', 'wallet');
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
      beforeEach(() => {
        cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      });
      it('25 tx are shown, scrolling loads another 25', () => {
        testSet.open();
        cy.get(ss.transactionRow).should('have.length', 25);
        cy.get('.transaction-results').scrollTo('bottom');
        cy.get('.transactions-row').should('have.length', 50);
      });

      it('Click leads to tx details', () => {
        testSet.open();
        cy.get(ss.transactionRow).eq(0).click();
        cy.url().should('contain', '?id=');
        cy.get(ss.transactionDetailBackButton);
      });

      describe('Account info tabs', () => {
        beforeEach(() => {
          cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
        });
        it('Shows 101 votes', () => {
          testSet.open();
          waitBeforeChangeTabAfterLoading();
          cy.get(ss.accountInfoTab).click();
          cy.get(ss.showMoreVotesBtn).click();
          cy.get(ss.votedAdress).should('have.length', 101);
        });

        it('Shows voted delegate nickname ', () => {
          testSet.open();
          waitBeforeChangeTabAfterLoading();
          cy.get(ss.accountInfoTab).click();
          cy.get(ss.votedAdress).eq(0).should('have.text', 'genesis_1 ');
        });

        it('Click on voted delegate leads to account page', () => {
          testSet.open();
          waitBeforeChangeTabAfterLoading();
          cy.get(ss.accountInfoTab).click();
          cy.get(ss.votedAdress).eq(0).click();
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
      });
      describe('Delegate statistics tab', () => {
        it('Shows voted delegate nickname ', () => {
          testSet.open();
          waitBeforeChangeTabAfterLoading();
          cy.get(ss.delegateStatisticsTab).click();
          cy.get(ss.votedAdress).eq(0).should('have.text', 'genesis_17 ');
        });

        it('Click on voted delegate leads to account page', () => {
          testSet.open();
          waitBeforeChangeTabAfterLoading();
          cy.get(ss.delegateStatisticsTab).click();
          cy.get(ss.votedAdress).eq(0).click();
          cy.get(ss.delegateName).should('have.text', 'genesis_17');
        });

        // TODO Fix after corresponding bugfix
        xit('Shows voters nickname if it is delegate', () => {
          testSet.open();
          waitBeforeChangeTabAfterLoading();
          cy.get(ss.delegateStatisticsTab).click();
          cy.get(ss.voterAdress).eq(0).should('have.text', 'genesis_1 ');
        });

        it('Shows voters address if it is not delegate', () => {
          testSet.open();
          waitBeforeChangeTabAfterLoading();
          cy.get(ss.delegateStatisticsTab).click();
          cy.get(ss.voterAdress).eq(1).should('have.text', '16313739661670634666L ');
        });

        it('Click on voter leads to account page', () => {
          testSet.open();
          waitBeforeChangeTabAfterLoading();
          cy.get(ss.delegateStatisticsTab).click();
          cy.get(ss.voterAdress).eq(1).click();
          cy.get(ss.explorerAccountLeftBlock).find(ss.accountAddress).should('have.text', '16313739661670634666L');
        });
      });
    });
  });
});
