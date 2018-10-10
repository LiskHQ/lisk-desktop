import accounts from '../../../constants/accounts';

describe('Explorer page', () => {
  it('should show search results on custom node for an account and a transactions while being logged in', () => {
    cy.loginUI(accounts.genesis, 'dev');
    cy.get('#autosuggest-input').click().type('15610359283786884938L{enter}');
    cy.get('.empty-message').should('have.text', 'No activity yet');
    cy.get('.autosuggest-btn-close').click();
    cy.get('#autosuggest-input').click().type('16313739661670634666L{enter}');
    cy.url().should('contains', '/explorer/accounts/16313739661670634666L');
    cy.get('.transactions-row').should('have.length', 25);
    cy.get('.send-to-address').click();
    cy.get('#autosuggest-input').click().type('16313739661670634666L');
    cy.get('.home-link').click();
    cy.get('.autosuggest-btn-close').click();
    cy.get('#autosuggest-input').click().type('9938914350729699234{enter}');
    cy.get('.empty-message').should('have.text', 'No results');
    cy.get('.autosuggest-btn-close').click();
    cy.get('#autosuggest-input').click().type('1465651642158264047');
    cy.get('.transactions-result').click();
    cy.get('.transaction-id .copy-title').should('have.text', '1465651642158264047');
  });

  it('should show added voters in "voted delegate" transaction type while being logged in', () => {
    cy.loginUI(accounts.genesis, 'dev');
    cy.get('#autosuggest-input').click().type('18294919898268153226');
    cy.get('.transactions-result').click();
    cy.get('.voter-address').should('have.length', 33);
    cy.get('.home-link').click();
    cy.get('.autosuggest-btn-close').click();
    cy.get('#autosuggest-input').click().type('2581762640681118072L');
    cy.get('.addresses-result').click();
    cy.get('.delegate-statistics').click();
    cy.get('.votersFilterQuery-row').should('have.length', 2);
    cy.get('.home-link').click();
    cy.get('.autosuggest-btn-close').click();
    cy.get('#autosuggest-input').click().type('4401082358022424760L');
    cy.get('.addresses-result').click();
    cy.wait(3000);
    cy.get('.delegate-statistics').click();
    cy.get('.votesFilterQuery-row').should('have.length', 10);
  });
});
