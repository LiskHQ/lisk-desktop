import urls from '../../constants/urls';
import ss from '../../constants/selectors';
import accounts from '../../constants/accounts';
import networks from '../../constants/networks';

describe('Dashboard', () => {
  it('Quick tips are present on page when logged out', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.app).contains('What is a Lisk ID?');
  });

  it('Quick tips are not present on page when logged in', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.dashboard);
    cy.get(ss.app).contains('What is a Lisk ID?').should('not.exist');
  });

  it('Price chart is present on page', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.priceChart);
  });

  it('There are no Empty state components on page (logged out)', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.emptyResultsMessage).should('not.exist');
  });
});
