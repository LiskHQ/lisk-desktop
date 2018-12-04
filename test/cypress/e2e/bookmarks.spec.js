import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import ss from '../../constants/selectors';
import urls from '../../constants/urls';

describe('Bookmarks', () => {
  /**
   * Bookmarks suggestions are not present if there is no followers
   * @expect bookmarks components are not present
   */
  it('Bookmarks are not present if there is no followers', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.recipientInput).click();
    cy.get(ss.bookmarkInput).should('not.exist');
    cy.get(ss.bookmarkList).should('not.exist');
  });

  /**
   * Choose follower from bookmarks and send tx
   * @expect bookmark contain name
   * @expect bookmark contain address
   * @expect clicking bookmark fills recipient
   * @expect tx appears in activity with right address
   */
  it('Choose follower from bookmarks and send tx', () => {
    window.localStorage.setItem('followedAccounts', `[
      {"title":"Alice","address":"${accounts.delegate.address}","balance":101}
    ]`);
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.recipientInput).click();
    cy.get(ss.bookmarkInput);
    cy.get(ss.bookmarkList).eq(0).contains('Alice');
    cy.get(ss.bookmarkList).eq(0).contains(accounts.delegate.address);
    cy.get(ss.bookmarkList).eq(0).click();
    cy.get(ss.recipientInput).should('have.value', accounts.delegate.address);
    cy.get(ss.amountInput).click().type(1);
    cy.get(ss.nextTransferBtn).click();
    cy.get(ss.sendBtn).click();
    cy.get(ss.transactionRow).eq(0).find(ss.transactionAddress).should('have.text', accounts.delegate.address);
  });

  /**
   * Search through bookmarks by typing
   * @expect account found by name
   * @expect non-existent search show empty list
   * @expect account found by delegate
   */
  it('Search through bookmarks by typing', () => {
    window.localStorage.setItem('followedAccounts', `[
      {"title":"Alice","address":"${accounts.delegate.address}","balance":101},
      {"title":"Bob","address":"${accounts.genesis.address}","balance":101}
    ]`);
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.recipientInput).click().type('Bob');
    cy.get(ss.bookmarkList).eq(0).contains('Bob');
    cy.get(ss.recipientInput).clear();
    cy.get(ss.recipientInput).click().type('Merkel');
    cy.get(ss.bookmarkList).should('not.exist');
    cy.get(ss.recipientInput).clear();
    cy.get(ss.recipientInput).click().type(accounts.delegate.address);
    cy.get(ss.bookmarkList).eq(0).contains(accounts.delegate.address);
    cy.get(ss.bookmarkList).eq(0).click();
    cy.get(ss.recipientInput).should('have.value', accounts.delegate.address);
  });
});
