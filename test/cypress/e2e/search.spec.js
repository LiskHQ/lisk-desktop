import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import ss from '../../constants/selectors';

const getSearchesObjFromLS = () => JSON.parse(localStorage.getItem('searches'));

describe('Search', () => {
  const testnetTransaction = '755251579479131174';
  const mainnetTransaction = '881002485778658401';
  const mainnetDelegateName = 'tembo';

  function assertAccountPage(accountsAddress) {
    cy.get(ss.leftBlockAccountExplorer).find(ss.accountAddress).should('have.text', accountsAddress)
      .and(() => {
        expect(getSearchesObjFromLS()[0].id).to.equal(accountsAddress);
        expect(getSearchesObjFromLS()[0].searchTerm).to.equal(accountsAddress);
      });
  }

  function assertTransactionPage(transactionId) {
    cy.get(ss.transactionId).should('have.text', transactionId)
      .and(() => {
        expect(getSearchesObjFromLS()[0].id).to.equal(transactionId);
        expect(getSearchesObjFromLS()[0].searchTerm).to.equal(transactionId);
      });
  }

  function assertDelegatePage(delegateName, delegateId) {
    cy.get(ss.leftBlockAccountExplorer).find(ss.delegateName).should('have.text', delegateName)
      .and(() => {
        expect(getSearchesObjFromLS()[0].id).to.equal(delegateId);
        expect(getSearchesObjFromLS()[0].searchTerm).to.equal(delegateName);
      });
  }

  /**
   * Search for Lisk ID using keyboard Enter, signed out
   * @expect account page with corresponding ID is a result
   * @expect localStorage have the searches object with correct address
   * @expect localStorage have the searches object with correct searchTerm
   */
  it('Search for Lisk ID using keyboard Enter, signed off', () => {
    cy.visit('/');
    cy.get(ss.searchInput).click().type(`${accounts.delegate.address}{enter}`);
    assertAccountPage(accounts.delegate.address);
  });

  /**
   * Search for Lisk ID using suggestions, signed in
   * @expect account page with corresponding ID is a result
   * @expect localStorage have the searches object with correct address
   * @expect localStorage have the searches object with correct searchTerm
   */
  it('Search for Lisk ID using suggestions, signed in', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit('/');
    cy.get(ss.searchInput).click().type(`${accounts.delegate.address}`);
    cy.get(ss.idResults).eq(0).click();
    assertAccountPage(accounts.delegate.address);
  });

  /**
   * Search for transaction using keyboard Enter, signed off
   * @expect transaction details page a result
   * @expect localStorage have the searches object with correct id
   * @expect localStorage have the searches object with correct searchTerm
   */
  it('Search for Transaction using keyboard Enter, signed off', () => {
    cy.visit('/');
    cy.get(ss.searchInput).click().type(`${mainnetTransaction}{enter}`);
    assertTransactionPage(mainnetTransaction);
  });

  /**
   * Search for transaction using suggestions, signed in
   * @expect transaction details page a result
   * @expect localStorage have the searches object with correct id
   * @expect localStorage have the searches object with correct searchTerm
   */
  it('Search for Transaction using suggestions, signed in', () => {
    cy.autologin(accounts.genesis.passphrase, networks.testnet.node);
    cy.visit('/');
    cy.get(ss.searchInput).click().type(`${testnetTransaction}`);
    cy.get(ss.transactionResults).eq(0).click();
    assertTransactionPage(testnetTransaction);
  });

  /**
   * Search for delegate using keyboard Enter, signed off
   * @expect account page with corresponding ID is a result
   * @expect localStorage have the searches object with correct address
   * @expect localStorage have the searches object with correct searchTerm
   */
  // TODO reenable after #1351 fix
  it.skip('Search for Delegate using keyboard Enter, signed off', () => {
    cy.visit('/');
    cy.get(ss.searchInput).click().type(`${mainnetDelegateName}{enter}`);
    assertDelegatePage(accounts.delegate.username);
  });

  /**
   * Search for delegate using suggestions, signed in
   * @expect account page with corresponding ID is a result
   * @expect localStorage have the searches object with correct address
   * @expect localStorage have the searches object with correct searchTerm
   */
  it('Search for Delegate using suggestions, signed in', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit('/');
    cy.get(ss.searchInput).click().type(`${accounts.delegate.username}`);
    cy.get(ss.delegateResults).eq(0).click();
    assertDelegatePage(accounts.delegate.username, accounts.delegate.address);
  });

  /**
   * Search without signing in
   * @expect happens in mainnet
   */
  it('Search without signing in - happens in mainnet', () => {
    cy.visit('/');
    cy.get(ss.searchInput).click().type(`${accounts['mainnet delegate'].address}{enter}`);
    cy.get(ss.leftBlockAccountExplorer).find(ss.delegateName).should('have.text', accounts['mainnet delegate'].username);
  });

  /**
   * Search signed in mainnet
   * @expect happens in mainnet
   */
  it('Search signed in mainnet - happens in mainnet', () => {
    cy.autologin(accounts.genesis.passphrase, networks.mainnet.node);
    cy.visit('/');
    cy.get(ss.searchInput).click().type(`${accounts['mainnet delegate'].address}{enter}`);
    cy.get(ss.leftBlockAccountExplorer).find(ss.delegateName).should('have.text', accounts['mainnet delegate'].username);
  });

  /**
   * Search signed in testnet
   * @expect happens in testnet
   */
  it('Search signed in testnet - happens in testnet', () => {
    cy.autologin(accounts.genesis.passphrase, networks.testnet.node);
    cy.visit('/');
    cy.get(ss.searchInput).click().type(`${testnetTransaction}`);
    cy.get(ss.transactionResults).eq(0).click();
    cy.get(ss.transactionId).should('have.text', testnetTransaction);
  });

  /**
   * Search signed in devnet
   * @expect happens in devnet
   */
  it('Search signed in devnet - happens in devnet', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit('/');
    cy.get(ss.searchInput).click().type(`${accounts.delegate.address}{enter}`);
    cy.get(ss.leftBlockAccountExplorer).find(ss.delegateName).should('have.text', accounts.delegate.username);
  });

  /**
   * Search after logout
   * @expect happens in last used network
   */
  it('Search after logout - happens in last used network', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit('/');
    cy.get(ss.logoutBtn).click();
    cy.clearLocalStorage();
    cy.get(ss.dialogButtons).eq(1).click();
    cy.get(ss.searchInput).click().type(`${accounts.delegate.username}`);
    cy.get(ss.delegateResults).eq(0).click();
    cy.get(ss.leftBlockAccountExplorer).find(ss.delegateName).should('have.text', accounts.delegate.username);
  });

  /**
   * Recent searches are shown as search proposals and clickable
   * @expect recent searches are shown
   * @expect click on proposal leads to corresponding page
   */
  it('Recent searches are shown as search proposals and clickable', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    window.localStorage.setItem('searches', `[{"searchTerm":"${accounts.genesis.address}","id":"${accounts.genesis.address}"}]`);
    cy.visit('/');
    cy.get(ss.searchInput).click();
    cy.get(ss.recentSearches).eq(0).click();
    cy.get(ss.leftBlockAccountExplorer).find(ss.accountAddress).should('have.text', accounts.genesis.address);
  });

  /**
   * Search for nonexistent item
   * @expect no results message
   */
  it('Search for nonexistent item - shows no results message', () => {
    cy.visit('/');
    cy.get(ss.searchInput).click().type('43th3j4bt324{enter}');
    cy.get(ss.emptyResultsMessage).should('have.text', 'No results');
  });
});
