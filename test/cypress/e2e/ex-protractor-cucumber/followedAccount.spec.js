import accounts from '../../../constants/accounts';

describe('Followed accounts', () => {
  it('should add a followed account to list', () => {
    cy.loginUI(accounts.genesis, 'dev');
    cy.get('.followed-account').should('have.length', 0);
    cy.get('.add-account-button').click();
    cy.get('.address input').click().type('94495548317450502L');
    cy.get('.next').click();
    cy.get('.next').click();
    cy.get('.followed-account').should('have.length', 1);
    cy.get('.account-title input').should('have.value', '94495548317450502L');
    cy.get('.edit-accounts').click();
    cy.get('.account-title input').clear().type('Bob');
    cy.get('.edit-accounts').click();
    cy.get('.account-title input').should('have.value', 'Bob');
    cy.get('.followed-account').click();
    cy.url().should('include', '/explorer/accounts/94495548317450502L');
    cy.get('.account-title').should('have.text', 'Bob');
    cy.visit('/dashboard');
    cy.get('.edit-accounts').click();
    cy.get('.remove-account').click();
    cy.get('.followed-account').should('have.length', 0);
  });
});
