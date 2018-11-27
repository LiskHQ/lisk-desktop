import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import ss from '../../constants/selectors';

const getSearchesObjFromLS = () => JSON.parse(localStorage.getItem('searches'));

describe('Search', () => {
  const testnetTransaction = '755251579479131174';
  [
    {
      name: 'Search for Lisk ID using keyboard Enter',
      searchAction: () => {
        cy.get(ss.searchInput).click().type(`${accounts.delegate.address}{enter}`);
      },
    },
    {
      name: 'Search for Lisk ID using suggestions',
      searchAction: () => {
        cy.get(ss.searchInput).click().type(`${accounts.delegate.address}`);
        cy.get(ss.idResults).eq(0).click();
      },
    },
  ].forEach((testSet) => {
    /**
     * Search for Lisk ID
     * @expect account page with corresponding ID is a result
     * @expect localStorage have the searches object with correct address
     * @expect localStorage have the searches object with correct searchTerm
     */
    it(testSet.name, () => {
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit('/');
      testSet.searchAction();
      cy.get(ss.leftBlockAccountExplorer).find(ss.accountAddress).should('have.text', accounts.delegate.address)
        .and(() => {
          expect(getSearchesObjFromLS()[0].id).to.equal(accounts.delegate.address);
          expect(getSearchesObjFromLS()[0].searchTerm).to.equal(accounts.delegate.address);
        });
    });
  });

  [
    {
      name: 'Search for Transaction using keyboard Enter',
      searchAction: () => {
        cy.get(ss.searchInput).click().type(`${testnetTransaction}{enter}`);
      },
    },
    {
      name: 'Search for Transaction using suggestions',
      searchAction: () => {
        cy.get(ss.searchInput).click().type(`${testnetTransaction}`);
        cy.get(ss.transactionResults).eq(0).click();
      },
    },
  ].forEach((testSet) => {
    /**
     * Search for transaction
     * @expect transaction details page a result
     * @expect localStorage have the searches object with correct id
     * @expect localStorage have the searches object with correct searchTerm
     */
    it(testSet.name, () => {
      cy.autologin(accounts.genesis.passphrase, networks.testnet.node);
      cy.visit('/');
      testSet.searchAction();
      cy.get(ss.transactionId).should('have.text', testnetTransaction)
        .and(() => {
          expect(getSearchesObjFromLS()[0].id).to.equal(testnetTransaction);
          expect(getSearchesObjFromLS()[0].searchTerm).to.equal(testnetTransaction);
        });
    });
  });

  [
    // TODO reenable after #1351 fix
    // {
    //   name: 'Search for Delegate using keyboard Enter',
    //   searchAction: () => {
    //     cy.get(ss.searchInput).click().type(`${accounts.delegate.username}{enter}`);
    //   },
    // },
    {
      name: 'Search for Delegate using suggestions',
      searchAction: () => {
        cy.get(ss.searchInput).click().type(`${accounts.delegate.username}`);
        cy.get(ss.delegateResults).eq(0).click();
      },
    },
  ].forEach((testSet) => {
    /**
     * Search for delegate
     * @expect account page with corresponding ID is a result
     * @expect localStorage have the searches object with correct address
     * @expect localStorage have the searches object with correct searchTerm
     */
    it(testSet.name, () => {
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit('/');
      testSet.searchAction();
      cy.get(ss.leftBlockAccountExplorer).find(ss.delegateName).should('have.text', accounts.delegate.username)
        .and(() => {
          expect(getSearchesObjFromLS()[0].id).to.equal(accounts.delegate.address);
          expect(getSearchesObjFromLS()[0].searchTerm).to.equal(accounts.delegate.username);
        });
    });
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
