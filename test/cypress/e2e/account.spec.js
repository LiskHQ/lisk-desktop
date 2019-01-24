import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';

const getFollowedAccountObjFromLS = () => JSON.parse(localStorage.getItem('followedAccounts'));

describe('Account', () => {
  /**
   * Help page can be opened by direct link
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  it('Opens by url + Address & Balance are correct', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.accounts}/16313739661666666666L`);
    cy.url().should('contain', '16313739661666666666L');
    cy.get(ss.leftBlockAccountExplorer).find(ss.accountAddress).contains('16313739661666666666L');
    cy.get(ss.leftBlockAccountExplorer).find(ss.accountBalance).contains('0');
  });

  it('Username is shown if registered', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.accounts}/${accounts.genesis.address}`);
    cy.get(ss.leftBlockAccountExplorer).find(ss.delegateName).should('not.exist');
    cy.visit(`${urls.accounts}/${accounts.delegate.address}`);
    cy.get(ss.leftBlockAccountExplorer).find(ss.delegateName).contains(accounts.delegate.username);
  });

  it('Add / Remove bookmark', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.accounts}/${accounts.delegate.address}`);
    cy.get(ss.followAccountBtn).contains('Add to bookmark');
    cy.get(ss.followAccountBtn).click();
    cy.get(ss.titleInput).type('Bob');
    cy.get(ss.confirmAddToBookmarks).click()
      .should(() => {
        expect(getFollowedAccountObjFromLS()[0].address).to.equal(accounts.delegate.address);
        expect(getFollowedAccountObjFromLS()[0].title).to.equal('Bob');
      });
    cy.get(ss.bookmarkedAccountTitle).contains('Bob');
    cy.get(ss.followAccountBtn).contains('Remove from bookmark');
    cy.get(ss.followAccountBtn).click()
      .should(() => {
        expect(getFollowedAccountObjFromLS().length).to.equal(0);
      });
    cy.get(ss.bookmarkedAccountTitle).should('not.exist');
  });
});
