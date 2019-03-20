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
    cy.visit(`${urls.accounts}/${accounts.genesis.address}`);
    // Timeout to avoid Cypress bug
    // https://github.com/cypress-io/cypress/issues/695
    cy.wait(1000);
    cy.url().should('contain', accounts.genesis.address);
    cy.get(ss.accountAddress).contains(accounts.genesis.address);
  });

  it('Username is shown if registered', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.accounts}/${accounts.delegate.address}`);
    // Timeout to avoid Cypress bug
    // https://github.com/cypress-io/cypress/issues/695
    cy.wait(2000);
    cy.get(ss.accountName).contains(accounts.delegate.username);
  });

  it('Add / Remove bookmark', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.accounts}/${accounts.genesis.address}`);
    // Timeout to avoid Cypress bug
    // https://github.com/cypress-io/cypress/issues/695
    cy.wait(1000);
    cy.get(ss.followAccountBtn).contains('Follow');
    cy.get(ss.followAccountBtn).click();
    cy.get(ss.titleInput).type('Bob');
    cy.get(ss.confirmAddToBookmarks).click()
      .should(() => {
        expect(getFollowedAccountObjFromLS()[0].address).to.equal(accounts.genesis.address);
        expect(getFollowedAccountObjFromLS()[0].title).to.equal('Bob');
      });
    cy.get(ss.accountName).contains('Bob');
    cy.get(ss.followAccountBtn).contains('Following');
    cy.get(ss.followAccountBtn).click();
    cy.get(ss.confirmAddToBookmarks).click()
      .should(() => {
        expect(getFollowedAccountObjFromLS().length).to.equal(0);
      });
    cy.get(ss.accountName).contains('Wallet');
  });
});
