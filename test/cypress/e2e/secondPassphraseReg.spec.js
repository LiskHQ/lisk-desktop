import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import moveMouseRandomly from '../utils/moveMouseRandomly';
import slideCheckbox from '../utils/slideCheckbox';

const ss = {
  nextButton: '.next',
  revealCheckbox: '.reveal-checkbox',
  passphraseTextarea: 'textarea.passphrase',
  itsSafeBtn: '.yes-its-safe-button',
  passphraseWordHolder: '.passphrase-holder label',
  getToDashboardBtn: '.get-to-your-dashboard-button',
  backButton: '.multistep-back',
  confirmCheckbox: '.confirm-checkbox',
  transactionRow: '.transactions-row',
  spinner: '.spinner',
  transactionAddress: '.transaction-address span',
  transactionReference: '.transaction-reference',
  transactionAmount: '.transactionAmount span',
  transactionAmountPlaceholder: '.transactionAmount',
};

describe('Second Passphrase Registration', () => {
  it(`opens by url ${urls.secondPassphrase}`, () => {
    cy.autologin(accounts['second passphrase candidate'].passphrase, networks.devnet.node);
    cy.visit(urls.secondPassphrase);
    cy.url().should('not.contain', 'referrer', 'Check if you have registered passphrase already');
    cy.url().should('not.contain', urls.dashboard, 'Check if you have registered passphrase already');
    cy.url().should('contain', urls.secondPassphrase);
    cy.get(ss.nextButton);
  });
  // TODO Add balance substraction check after #1391 is fixed
  it('set up second passphrase', function () {
    cy.autologin(accounts['second passphrase candidate'].passphrase, networks.devnet.node);
    cy.visit(urls.secondPassphrase);
    cy.get(ss.nextButton).click();
    moveMouseRandomly();
    slideCheckbox(ss.revealCheckbox);
    cy.get(ss.passphraseTextarea).invoke('text').as('passphrase');
    cy.get(ss.itsSafeBtn).click();
    cy.get(ss.passphraseWordHolder).each(($el) => {
      if (this.passphrase.includes($el[0].textContent)) cy.wrap($el).click();
    });
    slideCheckbox(ss.confirmCheckbox);
    cy.get(ss.getToDashboardBtn, { timeout: 20000 }).click();
    cy.url().should('contain', urls.dashboard);
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find(ss.spinner).should('not.exist');
    cy.get('@tx').find(ss.transactionAddress).should('have.text', 'Second passphrase registration');
    cy.get('@tx').find(ss.transactionReference).should('have.text', '-');
    cy.get('@tx').find(ss.transactionAmountPlaceholder).should('have.text', '-');
  });
});
