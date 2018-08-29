import accounts from '../../../constants/accounts';

describe('Login', () => {
  it('should allow to login to Testnet through network options launch protocol', () => {
    cy.visit('/');
    cy.get('.network').should('have.length', 0);
    cy.visit('/setting');
    cy.get('.showNetwork').click();
    cy.visit('/');
    cy.get('.network').click();
    cy.get('ul li').eq(2).click();
    cy.get('.passphrase input').click();
    cy.get('.passphrase input').each(($el, index) => {
      const passphraseWordsArray = accounts.genesis.passphrase.split(' ');
      cy.wrap($el).type(passphraseWordsArray[index]);
    });
    cy.get('.login-button').click();
    cy.get('.account-information-address .copy-title').should('have.text', accounts.genesis.address);
    cy.get('.network-status').should('have.text', 'Connected to testnet');
    cy.get('.main-tabs #transactions').click();
    cy.get('.transactions-row').should('have.length', 25);
  });

  it('should allow to login to Custom node through network options launch protocol', () => {
    cy.visit('/');
    cy.get('.network').should('have.length', 0);
    cy.visit('/setting');
    cy.get('.showNetwork').click();
    cy.visit('/');
    cy.get('.network').click();
    cy.get('ul li').eq(3).click();
    cy.get('.address input').type('https://testnet.lisk.io');
    cy.get('.passphrase input').click();
    cy.get('.passphrase input').each(($el, index) => {
      const passphraseWordsArray = accounts.genesis.passphrase.split(' ');
      cy.wrap($el).type(passphraseWordsArray[index]);
    });
    cy.get('.login-button').click();
    cy.get('.account-information-address .copy-title').should('have.text', accounts.genesis.address);
    cy.get('.network-status').should('have.text', 'Connected to testnet');
    cy.get('.main-tabs #transactions').click();
    cy.get('.transactions-row').should('have.length', 25);
  });
});
