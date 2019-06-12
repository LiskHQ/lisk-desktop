import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';

describe('Transactions', () => {
  /**
   * Clicking show more button triggers loading another portion of txs
   * @expect more txs are present
   */
  it('30 tx are shown, clicking show more loads more transactions', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.transactionRow).should('have.length', 30);
    cy.get(ss.showMoreButton).click();
    cy.get(ss.transactionRow).should('have.length.greaterThan', 30);
  });

  /**
   * Click on transaction row leads to tx details page
   * @expect url
   * @expect some specific to page element is present on it
   */
  it('Click leads to tx details', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.transactionRow).eq(0).click();
    cy.url().should('contain', urls.transactions);
  });

  /**
   * Transaction tabs show filtered transaction lists
   * @expect incoming txs on Incoming tab
   * @expect outgoing txs on Outgoing tab
   * @expect all txs on All tab
   */
  /* eslint-disable max-statements */
  it('Incoming/Outgoing/All filtering works', () => {
    cy.autologin(accounts['second passphrase account'].passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.transactionsTable).contains('Second passphrase registration');
    cy.get(ss.filterIncoming).click().should('have.class', 'active');
    cy.get(ss.transactionsTable).contains('Second passphrase registration').should('not.exist');
    cy.get(ss.filterAll).click().should('have.class', 'active');
    cy.get(ss.transactionsTable).contains('Second passphrase registration');
    cy.get(ss.filterOutgoing).click().should('have.class', 'active');
    cy.get(ss.transactionsTable).contains(accounts.genesis.address).should('not.exist');
    cy.get(ss.transactionsTable).contains('Second passphrase registration');
  });
});
