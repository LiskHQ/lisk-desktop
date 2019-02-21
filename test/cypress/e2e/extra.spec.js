import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';

describe('Extra', () => {
  it('Sidechains page opens by sidebar button', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.sidechains);
    cy.get(ss.app).contains('Coming soon.');
  });

  it('Page not found page', () => {
    cy.visit('/sdk');
    cy.get(ss.app).contains('Page not found.');
  });
});
