/* eslint-disable */
import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import ss from '../../constants/selectors';
import urls from '../../constants/urls';

describe('Search', () => {
  const testnetTransaction = '755251579479131174';
  const mainnetTransaction = '881002485778658401';
  const devnetTransaction = '1260852969019107586';

  beforeEach(() => {
    cy.server();
    cy.route('/api/node/constants').as('constants');
    cy.route('/api/transactions**').as('requestTransaction');
    cy.route('/api/accounts**').as('requestAccount');
    cy.route('/api/delegates**').as('requestDelegate');

    it('4 search suggestions appears after 3 letters entered', () => {
      cy.autologin(accounts.genesis.passphrase, networks.testnet.node);
      openSearchAndType(accounts.delegate.username.substring(0, 3));
      cy.get(ss.searchDelegatesRow).should('have.length', 4);
    });

    /**
     * Search without signing in
     * @expect happens in mainnet
     */
    it('Search without signing in - happens in mainnet', () => {
      openSearchAndType(mainnetTransaction);
      cy.wait('@requestTransaction');
      cy.get(ss.searchTransactionRow);
    });

    /**
     * Search signed in mainnet
     * @expect happens in mainnet
     */
    // TODO figure out what is wrong, fix it and enable this test. For details see:
    // https://dashboard.cypress.io/#/projects/528xi2/runs/399/specs
    it.skip('Search signed in mainnet - happens in mainnet', () => {
      cy.autologin(accounts.genesis.passphrase, networks.mainnet.node);
      openSearchAndType(mainnetTransaction);
      cy.wait('@requestTransaction');
      cy.get(ss.searchTransactionRow);
    });

    /**
     * Search signed in testnet
     * @expect happens in testnet
     */
    it('Search signed in testnet - happens in testnet', () => {
      cy.autologin(accounts.genesis.passphrase, networks.testnet.node);
      openSearchAndType(testnetTransaction);
      cy.get(ss.searchTransactionRow);
    });

    /**
     * Search signed in devnet
     * @expect happens in devnet
     */
    it('Search signed in devnet - happens in devnet', () => {
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      openSearchAndType(devnetTransaction);
      cy.get(ss.searchTransactionRow);
    });

    /**
     * Search after logout
     * @expect happens in last used network
     */
    // TODO figure out why this tests fails on jenkins only
    it.skip('Search after logout - happens in last used network', () => {
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit(urls.dashboard);
      cy.get(ss.userAccount).click();
      cy.get(ss.logoutBtn).click();
      cy.get(ss.searchIcon).click();
      cy.get(ss.searchInput).type(devnetTransaction);
      cy.get(ss.searchTransactionRow);
    });


    /**
     * Type not existent gibberish of chars
     * @expect 'No results found' message
     */
    it('Type nonexistent thing - dropdown shows not results found message', () => {
      openSearchAndType('43th3j4bt324');
      cy.get(ss.searchMessage).eq(0).should('have.text', 'No results found.');
    });
  });
});
