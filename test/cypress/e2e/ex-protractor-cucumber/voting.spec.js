import accounts from '../../../constants/accounts';

describe('Voting page', () => {
  it('should allow to view delegates and more on scroll and search them and vote for them', () => {
    cy.loginUI(accounts['delegate candidate'], 'dev');
    cy.visit('delegates');
    cy.get('.delegate-row').should('have.length', 100);
    cy.get('.delegate-list').scrollTo('bottom');
    cy.get('.delegate-row').should('have.length', 200);
    cy.get('input.search').click().type('genesis_42');
    cy.get('.delegate-row').should('have.length', 1);
    cy.get('.clean-icon').click();
    cy.get('input.search').click().type('doesntexist');
    cy.get('.delegate-row').should('have.length', 0);
    cy.get('.empty-message').should('have.text', 'No delegates found.');
    cy.get('.clean-icon').click();
    cy.get('.delegate-row li label').eq(3).click();
    cy.get('.delegate-row li label').eq(5).click();
    cy.get('.delegate-row li label').eq(8).click();
    cy.get('.next').click();
    cy.get('.confirm').click();
    cy.get('.result-box-message').should('have.text', 'You’re votes are being processed and will be confirmed. It may take up to 10 minutes to be secured in the blockchain.');
  });

  it.skip('should allow to select delegates by URL', () => {
    cy.loginUI(accounts['delegate candidate'], 'dev');
    cy.visit('/delegates/vote?votes=genesis_12,genesis_14,genesis_16');
    cy.get('.upvotes-message').should('have.text', 'genesis_12, genesis_14, genesis_16');
    cy.get('.next').click();
    cy.get('.confirm').click();
    cy.get('.result-box-message').should('have.text', 'You’re votes are being processed and will be confirmed. It may take up to 10 minutes to be secured in the blockchain.');
    cy.wait(10000);
    cy.visit('/wallet');
    cy.wait(20000);
    cy.visit('/delegates/vote?unvotes=genesis_12');
    cy.get('.unvotes-message').should('have.text', 'genesis_12');
    cy.visit('/wallet');
    cy.visit('/delegates/vote?votes=genesis_14,genesis_16');
    cy.get('.alreadyVoted-messages');
  });
});
