import ss from '../../constants/selectors';

describe('Extra', () => {
  it('Page not found page', () => {
    cy.visit('/sdk');
    cy.get(ss.app).contains('Page not found.');
  });
});
