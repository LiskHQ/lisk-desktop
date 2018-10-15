import accounts from '../../constants/accounts';
import networks from '../../constants/networks';

const ss = {
  addAccountButton: '.add-account-button',
  addressInput: '.address input',
  nextButton: '.next',
  followedAccountItem: '.followed-account',
  titleInput: '.account-title input',
  accountBalance: '.followed-account-balance',
};

const getFollowedAccountObjFromLS = () => JSON.parse(localStorage.getItem('followedAccounts'));

describe('Following', () => {
  it('Add follower without title as guest', () => {
    cy.visit('/dashboard');
    cy.get(ss.addAccountButton).click();
    cy.get(ss.addressInput).click().type(accounts.genesis.address);
    cy.get(ss.nextButton).click();
    cy.get(ss.nextButton).click()
      .should(() => {
        expect(getFollowedAccountObjFromLS()[0].address).to.equal(accounts.genesis.address);
        expect(getFollowedAccountObjFromLS()[0].title).to.equal(accounts.genesis.address);
      });
    cy.get(ss.followedAccountItem).should('have.length', 1);
    cy.get(ss.titleInput).should('have.value', accounts.genesis.address);
  });

  it('Add follower with title while logged in', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit('/dashboard');
    cy.get(ss.addAccountButton).click();
    cy.get(ss.addressInput).click().type(accounts.genesis.address);
    cy.get(ss.nextButton).click();
    cy.get(ss.titleInput).type('Bob');
    cy.get(ss.nextButton).click()
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

    it('Edit followers title', () => {
      cy.visit('/dashboard');
      cy.get('.edit-accounts').click();
      cy.get(ss.titleInput).clear().type('Bob');
      cy.get('.edit-accounts').click();
      cy.get('.account-title input').should('have.value', 'Bob');
    });

    it('Delete a follower', () => {
      cy.visit('/dashboard');
      cy.get('.edit-accounts').click();
      cy.get('.remove-account').click();
      cy.get('.followed-account').should('not.exist');
    });

    it('Open followers account', () => {
      cy.visit('/dashboard');
      cy.get('.followed-account').click();
      cy.url().should('include', '/explorer/accounts/16313739661670634666L');
    });

    it('Not possible to add duplicate', () => {
      cy.visit('/dashboard');
      cy.get(ss.addAccountButton).click();
      cy.get(ss.addressInput).click().type(accounts.genesis.address);
      cy.get(ss.nextButton).should('be.disabled');
    });
  });
});
