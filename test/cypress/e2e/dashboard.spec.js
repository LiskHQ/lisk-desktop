import urls from '../../constants/urls';
import ss from '../../constants/selectors';

describe('Dashboard', () => {
  it('Quick tips are present on page when logged out', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.app).contains('What is a Lisk ID?');
  });

  it('Price chart is present on page', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.priceChart);
  });

  it('There is no Empty state components on page when logged out', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.emptyResultsMessage).should('not.exist');
  });
});
