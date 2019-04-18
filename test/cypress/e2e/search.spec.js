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
  });

  function openSearchAndType(string) {
    cy.visit(urls.dashboard).then(() => {
      if (window.localStorage.getItem('liskCoreUrl')) cy.wait('@constants');
    });
    cy.get(ss.searchIcon).click();
    cy.get(ss.searchInput).type(string);
  }

  function assertAccountPage(accountsAddress) {
    cy.wait('@requestAccount');
    cy.wait('@requestDelegate');
    cy.get(ss.accountAddress).should('have.text', accountsAddress);
  }

  function assertDelegatePage(accountsName) {
    cy.wait('@requestAccount');
    cy.wait('@requestDelegate');
    cy.get(ss.accountName).should('have.text', accountsName);
  }

  function assertTransactionPage(transactionId) {
    cy.wait('@requestTransaction');
    cy.get(ss.transactionId).should('have.text', transactionId);
  }

  /**
   * Search for Lisk ID using keyboard Enter, signed out
   * @expect account page with corresponding ID is a result
   * @expect localStorage have the searches object with correct address
   * @expect localStorage have the searches object with correct searchTerm
   */
  it('Search for Lisk ID using keyboard Enter, signed off', () => {
    openSearchAndType(accounts.delegate.address);
    cy.get(ss.searchAccountRow).eq(0).click();
    assertAccountPage(accounts.delegate.address);
  });

  /**
   * Search for Lisk ID using suggestions, signed in
   * @expect account page with corresponding ID is a result
   */
  it('Search for Lisk ID using suggestions, signed in', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    openSearchAndType(accounts.delegate.address);
    cy.get(ss.searchAccountRow).eq(0).click();
    assertAccountPage(accounts.delegate.address);
  });

  /**
   * Search for transaction using keyboard Enter, signed off
   * @expect transaction details page a result
   */
  it('Search for Transaction using keyboard Enter, signed off', () => {
    openSearchAndType(mainnetTransaction);
    cy.get(ss.searchTransactionRow).eq(0).click();
    assertTransactionPage(mainnetTransaction);
  });

  /**
   * Search for transaction using suggestions, signed in
   * @expect transaction details page a result
   */
  it('Search for Transaction using suggestions, signed in', () => {
    cy.autologin(accounts.genesis.passphrase, networks.testnet.node);
    openSearchAndType(testnetTransaction);
    cy.get(ss.searchTransactionRow).eq(0).click();
    assertTransactionPage(testnetTransaction);
  });

  /**
   * Search for delegate using keyboard Enter, signed off
   * @expect account page with corresponding ID is a result
   */
  it('Search for Delegate using keyboard Enter, signed off', () => {
    openSearchAndType(accounts['mainnet delegate'].username);
    cy.get(ss.searchDelegatesRow).eq(0).click();
    assertDelegatePage(accounts['mainnet delegate'].username);
  });

  /**
   * Search for delegate using suggestions, signed in
   * @expect account page with corresponding ID is a result
   */
  it('Search for Delegate using suggestions, signed in', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    openSearchAndType(accounts.delegate.username);
    cy.get(ss.searchDelegatesRow).eq(0).click();
    assertDelegatePage(accounts.delegate.username);
  });

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
  it('Search signed in mainnet - happens in mainnet', () => {
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
  it('Search after logout - happens in last used network', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.dashboard);
    cy.get(ss.userAvatar).click();
    cy.get(ss.logoutBtn).click();
    cy.get(ss.searchIcon).click();
    cy.get(ss.searchInput).type(devnetTransaction);
    cy.get(ss.searchTransactionRow);
  });

  /**
   * Type not sufficient amount of chars
   * @expect 'Type at least 3 characters' message
   */
  it('Type 2 chars - dropdown shows not enough chars message', () => {
    openSearchAndType('43');
    cy.get(ss.searchMessage).eq(0).should('have.text', 'Type at least 3 characters');
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
