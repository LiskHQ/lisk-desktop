import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';
import compareBalances from '../utils/compareBalances';

const getFollowedAccountObjFromLS = () => JSON.parse(localStorage.getItem('followedAccounts'));

const txConfirmationTimeout = 14000;

describe('Bookmarks', () => {
  /**
   * Add follower in dashboard widget
   * @expect localStorage have the follower object with correct address
   * @expect localStorage have the follower object with correct title
   * @expect following account is shown in widget
   */
  it('Add bookmark while logged in', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.dashboard);
    cy.get(ss.addFollowerAccountButton).click();
    cy.get(ss.addressInput).click().type(accounts.genesis.address);
    cy.get(ss.nextBtn).click();
    cy.get(ss.titleInput).type('Bob');
    cy.get(ss.nextBtn).click()
      .should(() => {
        expect(getFollowedAccountObjFromLS()[0].address).to.equal(accounts.genesis.address);
        expect(getFollowedAccountObjFromLS()[0].title).to.equal('Bob');
      });
    cy.get(ss.followedAccountItem).should('have.length', 1);
    cy.get(ss.titleInput).should('have.value', 'Bob');
  });

  describe('Saved bookmark in localStorage', () => {
    beforeEach(() => {
      window.localStorage.setItem('followedAccounts', `[{"title":"Alice","address":"${accounts.genesis.address}","balance":101}]`);
    });

    /**
     * Edit followers title
     * @expect value has changed
     */
    it('Edit bookmarks title', () => {
      cy.visit(urls.dashboard);
      cy.get(ss.editFollowingAccounts).click();
      cy.get(ss.titleInput).clear().type('Bob');
      cy.get(ss.editFollowingAccounts).click();
      cy.get(ss.followedAccountTitle).should('have.value', 'Bob');
    });

    /**
     * Delete a follower
     * @expect follower is not there
     */
    it('Delete a bookmark', () => {
      cy.visit(urls.dashboard);
      cy.get(ss.editFollowingAccounts).click();
      cy.get(ss.removeFollowingAccount).click();
      cy.get(ss.followedAccount).should('not.exist');
    });

    /**
     * Follower account is clickable
     * @expect follower account is opened
     */
    it('Open bookmarked account', () => {
      cy.visit(urls.dashboard);
      cy.get(ss.followedAccount).click();
      cy.url().should('include', '/explorer/accounts/16313739661670634666L');
    });

    /**
     * Try to add duplicate followed account
     * @expect button is disabled
     */
    it('Not possible to add duplicate', () => {
      cy.visit(urls.dashboard);
      cy.get(ss.addFollowerAccountButton).click();
      cy.get(ss.addressInput).click().type(accounts.genesis.address);
      cy.get(ss.nextBtn).should('be.disabled');
    });

    it('Balance is correct and get live updates', function () {
      window.localStorage.setItem('followedAccounts', `[
        {"title":"Alice","address":"${accounts.genesis.address}","balance":101}
      ]`);
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit(urls.dashboard);
      cy.wait(500); // To let app fetch and update the actual balance
      cy.get(ss.followedAccountBalance).invoke('text').as('balanceBefore');
      cy.visit(urls.send);
      cy.get(ss.recipientInput).type(accounts.genesis.address);
      cy.get(ss.amountInput).click().type('1');
      cy.get(ss.nextTransferBtn).click();
      cy.get(ss.sendBtn).click();
      cy.visit(urls.dashboard);
      cy.get(ss.transactionRow).eq(0).find(ss.spinner);
      cy.get(ss.transactionRow).eq(0).find(ss.spinner, { timeout: txConfirmationTimeout }).should('not.exist');
      cy.wait(500); // To avoid updating lag
      cy.get(ss.followedAccountBalance).invoke('text').as('balanceAfter').then(() => {
        compareBalances(this.balanceBefore, this.balanceAfter, 0.1);
      });
    });
  });
});
