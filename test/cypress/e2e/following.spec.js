import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';

const getFollowedAccountObjFromLS = () => JSON.parse(localStorage.getItem('followedAccounts'));

describe('Following', () => {
  /**
   * Add follower in dashboard widget
   * @expect localStorage have the follower object with correct address
   * @expect localStorage have the follower object with correct title
   * @expect following account is shown in widget
   */
  it('Add follower while logged in', () => {
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

  describe('Saved follower in localStorage', () => {
    beforeEach(() => {
      window.localStorage.setItem('followedAccounts', `[{"title":"Alice","address":"${accounts.genesis.address}","balance":101}]`);
    });

    /**
     * Edit followers title
     * @expect value has changed
     */
    it('Edit followers title', () => {
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
    it('Delete a follower', () => {
      cy.visit(urls.dashboard);
      cy.get(ss.editFollowingAccounts).click();
      cy.get(ss.removeFollowingAccount).click();
      cy.get(ss.followedAccount).should('not.exist');
    });

    /**
     * Follower account is clickable
     * @expect follower account is opened
     */
    it('Open followers account', () => {
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
  });
});
