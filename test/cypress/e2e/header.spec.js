import numeral from 'numeral';
import accounts from '../../constants/accounts';
import { fromRawLsk } from '../../../src/utils/lsk';

describe.skip('Header', () => {
  beforeEach(() => {
    cy.login(accounts.genesis, 2);
    cy.visit('/dashboard');
  });

  it('Address is correct', () => {
    cy.get('.copy-title').should('have.text', accounts.genesis.address);
  });

  it('Balance is correct', () => {
    cy.get('.balance span').should('have.text', numeral(fromRawLsk(accounts.genesis.balance)).format('0,0.[0000000000000]'));
  });

  it('Avatar click -> Accounts page', () => {
    cy.get('.saved-accounts').click();
    cy.url().should('include', '/accounts');
    cy.get('.add-lisk-id-card');
  });
});
