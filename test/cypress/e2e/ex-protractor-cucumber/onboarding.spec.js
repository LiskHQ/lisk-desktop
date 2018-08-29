import accounts from '../../../constants/accounts';

beforeEach(() => {
  cy.addLocalStorage('settings', 'onBoarding', true);
});

describe('Onboarding', () => {
  it('should not start onboarding when not logged in', () => {
    cy.visit('/');
    cy.wait(1000);
    cy.get('.joyride-tooltip__header').should('have.length', 0);
  });

  it('should start onboarding automatically', () => {
    cy.loginUI(accounts.genesis, 'main');
    cy.wait(2000);
    cy.get('.joyride-tooltip__header').should('have.text', 'Welcome to Lisk Hub');
    cy.get('.joyride-tooltip__button--primary').click();
    cy.get('.joyride-tooltip__header').should('have.text', 'Lisk ID');
    cy.get('.joyride-tooltip__button--primary').click();
    cy.get('.joyride-tooltip__header').should('have.text', 'Explore the network');
    cy.get('.joyride-tooltip__button--primary').click();
    cy.get('.joyride-tooltip__header').should('have.text', 'Keep the overview');
    cy.get('.joyride-tooltip__button--primary').click();
    cy.get('.joyride-tooltip__header').should('have.text', 'Send LSK');
    cy.get('.joyride-tooltip__button--primary').click();
    cy.get('.joyride-tooltip__header').should('have.text', 'Manage your application');
    cy.get('.joyride-tooltip__button--primary').click();
    cy.get('.joyride-tooltip__header').should('have.text', 'Access extra features');
    cy.get('.joyride-tooltip__button--primary').click();
    cy.get('.joyride-tooltip__header').should('have.text', 'You’ve completed the tour!');
    cy.get('.joyride-tooltip__button--primary').click();
    cy.get('.joyride-tooltip__header').should('have.length', 0);
    cy.visit('/setting');
    cy.get('.advancedMode');
    cy.visit('/help');
    cy.get('.help-onboarding').click();
    cy.get('.joyride-tooltip__header').should('have.text', 'Welcome to Lisk Hub');
    cy.get('.joyride-tooltip__button--primary').click();
    cy.get('.joyride-tooltip__header').should('have.text', 'Lisk ID');
    cy.get('.joyride-tooltip__button--primary').click();
    cy.get('.joyride-tooltip__header').should('have.text', 'Explore the network');
    cy.get('.joyride-tooltip__button--primary').click();
    cy.get('.joyride-tooltip__header').should('have.text', 'Keep the overview');
    cy.get('.joyride-tooltip__button--primary').click();
    cy.get('.joyride-tooltip__header').should('have.text', 'Send LSK');
    cy.get('.joyride-tooltip__button--primary').click();
    cy.get('.joyride-tooltip__header').should('have.text', 'Manage your application');
    cy.get('.joyride-tooltip__button--primary').click();
    cy.get('.joyride-tooltip__header').should('have.text', 'Access extra features');
    cy.get('.joyride-tooltip__button--primary').click();
    cy.get('.joyride-tooltip__header').should('have.text', 'You’ve completed the tour!');
    cy.get('.joyride-tooltip__button--primary').click();
    cy.get('.joyride-tooltip__header').should('have.length', 0);
    cy.reload();
    cy.loginUI(accounts.genesis, 'main');
    cy.get('.joyride-tooltip__header').should('have.length', 0);
    cy.visit('/help');
    cy.get('.help-onboarding').click();
    cy.get('.joyride-tooltip__header').should('have.text', 'Welcome to Lisk Hub');
    cy.get('.joyride-tooltip__button--primary').click();
    cy.get('.joyride-tooltip__header').should('have.text', 'Lisk ID');
    cy.get('.joyride-tooltip__button--primary').click();
    cy.get('.joyride-tooltip__button--skip').click();
    cy.get('.joyride-tooltip__header').should('have.text', 'Onboarding whenever you need');
    cy.get('.joyride-tooltip__button--skip').click();
    cy.get('.joyride-tooltip__header').should('have.length', 0);
  });
});
