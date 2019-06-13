import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';

describe('Send: Bookmarks', () => {
  /**
   * Bookmarks suggestions are not present if there is no Bookmarks
   * @expect bookmarks components are not present
   */
  it('Bookmarks are not present if there is no Bookmarks', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node)
      .then(() => window.localStorage.removeItem('bookmarks'));
    cy.visit(urls.send);
    cy.get(ss.recipientInput).click();
    cy.get(ss.sendBookmarkList).should('not.be.visible');
  });

  /**
   * Choose Bookmark account from bookmarks and send tx
   * @expect bookmark contain name
   * @expect bookmark contain address
   * @expect clicking bookmark fills recipient
   * @expect tx appears in activity with right address
   */
  /* eslint-disable max-statements */
  it('Choose Bookmark account from bookmarks and send tx', () => {
    window.localStorage.setItem('bookmarks', `[
      {"title":"Alice","address":"${accounts.delegate.address}","balance":101},
      {"title":"Bob","address":"${accounts.genesis.address}","balance":101}
    ]`);
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.send);
    cy.get(ss.recipientInput).click();
    cy.get(ss.sendBookmarkList).should('be.visible');
    cy.get(ss.sendBookmarkList).eq(0).contains('Alice');
    cy.get(ss.sendBookmarkList).eq(0).contains(accounts.delegate.address);
    cy.get(ss.sendBookmarkList).eq(0).click();
    cy.get(ss.recipientInput).should('have.value', 'Alice');
    cy.get(ss.amountInput).click().type('1');
    cy.get(ss.nextTransferBtn).click();
    cy.get(ss.sendBtn).click();
    cy.get(ss.okayBtn).click();
    cy.wait(300);
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find(ss.transactionAddress).eq(0).should('have.text', 'Alice');
    cy.get('@tx').find(ss.transactionAddress).eq(1).should('have.text', accounts.delegate.address);
  });

  /**
   * Search through bookmarks by typing
   * @expect account found by name
   * @expect non-existent search show empty list
   * @expect account found by delegate
   */
  it('Search through bookmarks by typing', () => {
    window.localStorage.setItem('bookmarks', `[
      {"title":"Alice","address":"${accounts.delegate.address}","balance":101},
      {"title":"Bob","address":"${accounts.genesis.address}","balance":101}
    ]`);
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.send);
    cy.get(ss.recipientInput).click();
    cy.get(ss.recipientInput).click().type('Bo');
    cy.get(ss.sendBookmarkList).eq(0).contains('Bob');
    cy.get(ss.recipientInput).clear();
    cy.get(ss.recipientInput).click().type(accounts.delegate.address);
    cy.get(ss.sendBookmarkList).eq(0).contains(accounts.delegate.address);
    cy.get(ss.sendBookmarkList).eq(0).click();
    cy.get(ss.recipientInput).should('have.value', 'Alice');
  });
});
