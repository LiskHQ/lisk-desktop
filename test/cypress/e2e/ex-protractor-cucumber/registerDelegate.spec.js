import accounts from '../../../constants/accounts';

describe('Register delegate', () => {
  it('should allow to register a delegate on custom node with second passphrase', () => {
    cy.loginUI(accounts['second passphrase account'], 'dev');
    cy.visit('register-delegate');
    cy.get('.choose-name').click();
    cy.get('.delegate-name input').click().type('test3');
    cy.get('.submit-delegate-name').click();
    cy.get('.second-passphrase input').first().click();
    cy.get('.second-passphrase input').each(($el, index) => {
      const passphraseWordsArray = accounts['second passphrase account'].secondPassphrase.split(' ');
      cy.wrap($el).type(passphraseWordsArray[index]);
    });
    cy.get('.second-passphrase-next').click();
    cy.get('.confirm-delegate-registration').click();
    cy.wait(20000);
    cy.get('.success-header').should('have.text', 'Success!');
    cy.get('.success-description').should('have.text', 'Your registration is secured on the blockchain');
    cy.get('.registration-success').click();
    cy.get('.seeAllLink').should('have.length', 1);
  });
});
