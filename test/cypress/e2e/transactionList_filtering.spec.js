import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';

describe('Transaction list filtering', () => {
  beforeEach(() => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.filterTransactionsBtn).click();
  });

  it('Filter by 2 Dates, clear 1 filter to filter by 1 Date', () => {
    cy.get(ss.dateFromInputFilter).type('25.05.16');
    cy.get(ss.dateToInputFilter).type('26.05.16');
    cy.get(ss.applyFilters).click();
    cy.get(ss.transactionRow).should('have.length', 0);
    cy.get(ss.filter).contains('25').parent().find(ss.clearFilterBtn)
      .click();
    cy.get(ss.transactionRow).should('have.length', 2);
  });

  it('Date validation error', () => {
    cy.get(ss.dateFromInputFilter).type('45.43.54');
    cy.get(ss.filterDropdown).contains('Date must be in DD.MM.YY format');
    cy.get(ss.applyFilters).should('be.disabled');
  });

  it('Filter by 1 Amount, add second filter by 1 Amount', () => {
    cy.get(ss.amountFromInputFilter).type('4800');
    cy.get(ss.applyFilters).click();
    cy.get(ss.transactionRow).should('have.length', 4);
    cy.get(ss.filterTransactionsBtn).click();
    cy.get(ss.amountToInputFilter).type('4900');
    cy.get(ss.applyFilters).click();
    cy.get(ss.transactionRow).should('have.length', 2);
  });

  it('Amount validation error', () => {
    cy.get(ss.amountFromInputFilter).type('2');
    cy.get(ss.amountToInputFilter).type('1');
    cy.get(ss.filterDropdown).contains('Max amount must be greater than Min amount');
    cy.get(ss.applyFilters).should('be.disabled');
  });

  it('Filter by Message', () => {
    cy.get(ss.messageInputFilter).type('without-initialization');
    cy.get(ss.applyFilters).click();
    cy.get(ss.filterAll).click().should('have.class', 'active');
    cy.get(ss.transactionRow).should('have.length', 1);
  });

  it('Message validation error', () => {
    cy.get(ss.messageInputFilter).type(new Array(66).join('a'));
    cy.get(ss.filterDropdown).contains('Maximum length exceeded');
    cy.get(ss.applyFilters).should('be.disabled');
  });

  it('Filter by all filters combined, clear all filters', () => {
    cy.get(ss.dateFromInputFilter).type('03.04.19');
    cy.get(ss.dateToInputFilter).type('03.04.19');
    cy.get(ss.amountFromInputFilter).type('80');
    cy.get(ss.amountToInputFilter).type('80');
    cy.get(ss.messageInputFilter).type('second');
    cy.get(ss.applyFilters).click();
    cy.get(ss.transactionRow).should('have.length', 1);
    cy.get(ss.clearAllFiltersBtn).click();
    cy.get(ss.transactionRow).should('have.length', 30);
  });

  it('Incoming/Outgoing applies to filter results', () => {
    cy.get(ss.amountFromInputFilter).type('4900');
    cy.get(ss.applyFilters).click();
    cy.get(ss.transactionRow).should('have.length', 3);
    cy.get(ss.filterIncoming).click();
    cy.get(ss.transactionRow).should('have.length', 1);
    cy.get(ss.filterOutgoing).click();
    cy.get(ss.transactionRow).should('have.length', 2);
  });
});
