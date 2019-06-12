import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';

const getBookmarksObjFromLS = () => JSON.parse(localStorage.getItem('bookmarks')).LSK;

describe('Dashboard Bookmarks', () => {
  /**
   * Add Bookmark in dashboard widget
   * @expect localStorage have the Bookmark object with correct address
   * @expect localStorage have the Bookmark object with correct title
   * @expect Bookmark account is shown in widget
   * This test needs to be skipped until this task is implement (issue #2056)
   */
  it.skip('Add bookmark while logged in', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.dashboard);
    cy.get(ss.addBookmarkAccountButton).click();
    cy.get(ss.addressInput).click().type(accounts.genesis.address);
    cy.get(ss.nextBtn).click();
    cy.get(ss.titleInput).type('Bob');
    cy.get(ss.nextBtn).click()
      .should(() => {
        expect(getBookmarksObjFromLS()[0].address).to.equal(accounts.genesis.address);
        expect(getBookmarksObjFromLS()[0].title).to.equal('Bob');
      });
    cy.get(ss.bookmarkAccountItem).should('have.length', 1);
    cy.get(ss.titleInput).should('have.value', 'Bob');
  });

  describe('Saved bookmark in localStorage', () => {
    beforeEach(() => {
      window.localStorage.setItem('bookmarks', `[{"title":"Alice","address":"${accounts.genesis.address}","balance":101}]`);
    });

    /**
     * Edit Bookmark title
     * @expect value has changed
     * This test needs to be skipped until this task is implement (issue #2056)
     */
    it.skip('Edit bookmarks title', () => {
      cy.visit(urls.dashboard);
      cy.get(ss.editBookmarkAccounts).click();
      cy.get(ss.titleInput).clear().type('Bob');
      cy.get(ss.editBookmarkAccounts).click();
      cy.get(ss.bookmarkAccountTitle).should('have.value', 'Bob');
    });

    /**
     * Delete a Bookmark
     * @expect Bookmark is not there
     * This test needs to be skipped until this task is implement (issue #2056)
     */
    it.skip('Delete a bookmark', () => {
      cy.visit(urls.dashboard);
      cy.get(ss.editBookmarkAccounts).click();
      cy.get(ss.removeBookmarkAccount).click();
      cy.get(ss.bookmarkAccount).should('not.exist');
    });

    /**
     * Bookmark account is clickable
     * @expect Bookmark account is opened
     */
    it('Open bookmarked account', () => {
      cy.visit(urls.dashboard);
      cy.get(ss.bookmarkAccount).click();
      cy.url().should('include', '/explorer/accounts/16313739661670634666L');
    });

    /**
     * Try to add duplicate Bookmark account
     * @expect button is disabled
     * This test needs to be skipped until this task is implement (issue #2056)
     */
    it.skip('Not possible to add duplicate', () => {
      cy.visit(urls.dashboard);
      cy.get(ss.addBookmarkAccountButton).click();
      cy.get(ss.addressInput).click().type(accounts.genesis.address);
      cy.get(ss.nextBtn).should('be.disabled');
    });

    /**
     * 4 bookmarks are shown by default in newsfeed
     * @expect 4 bookmarks visible
     */
    it('5 bookmarks are shown by default', () => {
      window.localStorage.setItem('bookmarks', `[
        {"title":"1","address":"${accounts.genesis.address}","balance":101},
        {"title":"2","address":"${accounts.genesis.address}","balance":101},
        {"title":"3","address":"${accounts.genesis.address}","balance":101},
        {"title":"4","address":"${accounts.genesis.address}","balance":101},
        {"title":"5","address":"${accounts.genesis.address}","balance":101},
        {"title":"6","address":"${accounts.genesis.address}","balance":101}
      ]`);
      cy.visit(urls.dashboard);
      cy.get(ss.bookmarkAccount).eq(4).should('be.visible');
      cy.get(ss.bookmarkAccount).eq(6).should('be.not.visible');
    });
  });
});
