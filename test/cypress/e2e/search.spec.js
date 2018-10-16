import accounts from '../../constants/accounts';
import networks from '../../constants/networks';

const ss = {
  searchInput: '#autosuggest-input',
  delegateResults: '.delegates-result',
  transactionResults: '.transactions-result',
  recentSearches: '.addresses-result',
  idResults: '.addresses-result',
  clearSearchBtn: '.autosuggest-btn-close',
  explorerAccountLeftBlock: '.explorer-account-left-block',
  accountAddress: '.copy-title',
  accountBalance: '.balance span',
  delegateName: '.delegate-name',
  transactionId: '.transaction-id .copy-title',
  logoutBtn: '.logout',
  dialogButtons: '.ok-button',
  emptyResultsMessage: '.empty-message',
};

const testnetTransaction = '755251579479131174';

const getSearchesObjFromLS = () => JSON.parse(localStorage.getItem('searches'));

describe('Search', () => {
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
    it(testSet.name, () => {
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit('/');
      testSet.searchAction();
      cy.get(ss.explorerAccountLeftBlock).find(ss.accountAddress).should('have.text', accounts.delegate.address)
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
    it(testSet.name, () => {
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit('/');
      testSet.searchAction();
      cy.get(ss.explorerAccountLeftBlock).find(ss.delegateName).should('have.text', accounts.delegate.username)
        .and(() => {
          expect(getSearchesObjFromLS()[0].id).to.equal(accounts.delegate.address);
          expect(getSearchesObjFromLS()[0].searchTerm).to.equal(accounts.delegate.username);
        });
    });
  });

  it('Search without signing in - happens in mainnet', () => {
    cy.visit('/');
    cy.get(ss.searchInput).click().type(`${accounts['mainnet delegate'].address}{enter}`);
    cy.get(ss.explorerAccountLeftBlock).find(ss.delegateName).should('have.text', accounts['mainnet delegate'].username);
  });

  it('Search signed in mainnet - happens in mainnet', () => {
    cy.autologin(accounts.genesis.passphrase, networks.mainnet.node);
    cy.visit('/');
    cy.get(ss.searchInput).click().type(`${accounts['mainnet delegate'].address}{enter}`);
    cy.get(ss.explorerAccountLeftBlock).find(ss.delegateName).should('have.text', accounts['mainnet delegate'].username);
  });

  it('Search signed in testnet - happens in testnet', () => {
    cy.autologin(accounts.genesis.passphrase, networks.testnet.node);
    cy.visit('/');
    cy.get(ss.searchInput).click().type(`${testnetTransaction}`);
    cy.get(ss.transactionResults).eq(0).click();
    cy.get(ss.transactionId).should('have.text', testnetTransaction);
  });

  it('Search signed in devnet - happens in devnet', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit('/');
    cy.get(ss.searchInput).click().type(`${accounts.delegate.address}{enter}`);
    cy.get(ss.explorerAccountLeftBlock).find(ss.delegateName).should('have.text', accounts.delegate.username);
  });

  it('Search after logout - happens in last used network', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit('/');
    cy.get(ss.logoutBtn).click();
    cy.clearLocalStorage();
    cy.get(ss.dialogButtons).eq(1).click();
    cy.get(ss.searchInput).click().type(`${accounts.delegate.username}`);
    cy.get(ss.delegateResults).eq(0).click();
    cy.get(ss.explorerAccountLeftBlock).find(ss.delegateName).should('have.text', accounts.delegate.username);
  });

  it('Recent searches are shown as search proposals and clickable', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    window.localStorage.setItem('searches', `[{"searchTerm":"${accounts.genesis.address}","id":"${accounts.genesis.address}"}]`);
    cy.visit('/');
    cy.get(ss.searchInput).click();
    cy.get(ss.recentSearches).eq(0).click();
    cy.get(ss.explorerAccountLeftBlock).find(ss.accountAddress).should('have.text', accounts.genesis.address);
  });

  it('Search for nonexistent item - shows no results message', () => {
    cy.visit('/');
    cy.get(ss.searchInput).click().type('43th3j4bt324{enter}');
    cy.get(ss.emptyResultsMessage).should('have.text', 'No results');
  });
});
