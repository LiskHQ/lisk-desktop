import accounts from '../../../constants/accounts';

describe('Send dialog', () => {
  it('should allow to send when enough funds and correct address form', () => {
    cy.loginUI(accounts.genesis, 'test');
    cy.visit('/wallet');
    cy.get('.amount input').click().type('1');
    cy.get('.convertor').get('.converted-price').contains(/^\d{1,100}(\.\d{1,2})? USD$/);
    cy.get('.recipient input').click().type('23495548317450503L');
    cy.get('.send-next-button').click();
    cy.get('.send-button').click();
    cy.get('.result-box-message').should('have.text', 'Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain.');
  });

  it('should be correct number of transactions in a table', () => {
    cy.loginUI(accounts.genesis, 'dev');
    cy.get('.transactions-row').should('have.length', 5);
    cy.get('.seeAllLink').click();
    cy.get('.transactions-row').should('have.length', 25);
    cy.get('.transaction-results').scrollTo('bottom');
    cy.get('.transactions-row').should('have.length', 50);
  });

  it('should allow to send when using launch protocol', () => {
    cy.loginUI(accounts.genesis, 'dev');
    cy.visit('/wallet?recipient=4995063339468361088L&amount=5');
    cy.get('.recipient input').should('have.value', '4995063339468361088L');
    cy.get('.amount input').should('have.value', '5');
    cy.get('.send-next-button').click();
    cy.get('.send-button').click();
    cy.get('.result-box-message').should('have.text', 'Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain.');
  });

  it('should be able to init account if needed', () => {
    cy.loginUI(accounts.genesis, 'dev');
    cy.visit('wallet');
    cy.get('.amount input').click().type('1');
    cy.get('.convertor').get('.converted-price').contains(/^\d{1,100}(\.\d{1,2})? USD$/);
    cy.get('.recipient input').click().type('94495548317450502L');
    cy.get('.send-next-button').click();
    cy.get('.send-button').click();
    cy.wait(15000);
    cy.reload();
    cy.loginUI(accounts['without initialization'], 'dev');
    cy.visit('wallet');
    cy.get('.account-initialization').get('.account-init-button').click();
    cy.get('.send-button').click();
    cy.get('.result-box-message').should('have.text', 'Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain.');
    cy.get('.okay-button').click();
    cy.get('.account-initialization').should('have.length', 0);
    cy.wait(15000);
    cy.visit('dashboard');
    cy.visit('wallet');
    cy.get('.account-initialization').should('have.length', 0);
    cy.get('.transactions-row').should('have.length', 2);
  });
});
