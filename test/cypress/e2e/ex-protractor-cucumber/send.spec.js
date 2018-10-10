import accounts from '../../../constants/accounts';

describe('Send dialog', () => {
  it('should be correct number of transactions in a table', () => {
    cy.loginUI(accounts.genesis, 'dev');
    cy.get('.transactions-row').should('have.length', 5);
    cy.get('.seeAllLink').click();
    cy.get('.transactions-row').should('have.length', 25);
    cy.get('.transaction-results').scrollTo('bottom');
    cy.get('.transactions-row').should('have.length', 50);
  });
});
