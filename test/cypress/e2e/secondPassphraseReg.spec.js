import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import moveMouseRandomly from '../utils/moveMouseRandomly';
import slideCheckbox from '../utils/slideCheckbox';
import compareBalances from '../utils/compareBalances';

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
  headerBalance: '.balance span',
};

const txConfirmationTimeout = 20000;
const txSecondPassphraseRegPrice = 5;

describe('Second Passphrase Registration', () => {
  it(`Opens by u~rl ${urls.secondPassphrase}`, () => {
    cy.autologin(accounts['second passphrase candidate'].passphrase, networks.devnet.node);
    cy.visit(urls.secondPassphrase);
    cy.url().should('not.contain', 'referrer', 'Check if you have registered passphrase already');
    cy.url().should('not.contain', urls.dashboard, 'Check if you have registered passphrase already');
    cy.url().should('contain', urls.secondPassphrase);
    cy.get(ss.nextButton);
  });

  it('Set up second passphrase + Header balance is affected', function () {
    cy.autologin(accounts['second passphrase candidate'].passphrase, networks.devnet.node);
    cy.visit(urls.secondPassphrase);
    cy.get(ss.headerBalance).invoke('text').as('balanceBefore');
    cy.get(ss.nextButton).click();
    moveMouseRandomly();
    slideCheckbox(ss.revealCheckbox);
    cy.get(ss.passphraseTextarea).invoke('text').as('passphrase');
    cy.get(ss.itsSafeBtn).click();
    cy.get(ss.passphraseWordHolder).each(($el) => {
      if (this.passphrase.includes($el[0].textContent)) cy.wrap($el).click();
    });
    slideCheckbox(ss.confirmCheckbox);
    cy.get(ss.getToDashboardBtn, { timeout: txConfirmationTimeout }).click();
    cy.url().should('contain', urls.dashboard);
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find(ss.spinner).should('not.exist');
    cy.get('@tx').find(ss.transactionAddress).should('have.text', 'Second passphrase registration');
    cy.get('@tx').find(ss.transactionReference).should('have.text', '-');
    cy.get('@tx').find(ss.transactionAmountPlaceholder).should('have.text', '-');
    cy.get(ss.headerBalance).invoke('text').as('balanceAfter').then(() => {
      compareBalances(this.balanceBefore, this.balanceAfter, txSecondPassphraseRegPrice);
    });
  });
});
