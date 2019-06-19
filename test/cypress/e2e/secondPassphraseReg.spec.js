import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';
import compareBalances from '../utils/compareBalances';

const txConfirmationTimeout = 20000;
const txSecondPassphraseRegCost = 5;

describe('Second Passphrase Registration', () => {
  /**
   * Delegate registration page can be opened by direct link
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  it(`Opens by url ${urls.secondPassphrase}`, () => {
    cy.autologin(accounts['second passphrase candidate'].passphrase, networks.devnet.node);
    cy.visit(urls.secondPassphrase);
    cy.url().should('not.contain', 'referrer', 'Check if you have registered passphrase already');
    cy.url().should('not.contain', urls.dashboard, 'Check if you have registered passphrase already');
    cy.url().should('contain', urls.secondPassphrase);
    cy.get(ss.app).contains('Register 2nd passphrase');
  });

  /**
   * Setup second passphrase
   * @expect successfully go through registration process
   * @expect transaction appears in the activity list with valid details
   * @expect header balance value is decreased
   */
  it('Setup second passphrase + Header balance is affected', function () {
    cy.autologin(accounts['second passphrase candidate'].passphrase, networks.devnet.node);
    cy.visit(urls.secondPassphrase);
    cy.get(ss.headerBalance).invoke('text').as('balanceBefore');
    cy.get(ss.goToConfirmation).click();
    cy.get(ss.confirmationCheckbox).click();
    cy.get(ss.confirmButton).click();
    cy.get(ss.goToWallet, { timeout: txConfirmationTimeout }).click();
    cy.url().should('contain', urls.wallet);
    cy.get(`${ss.transactionRow} ${ss.spinner}`, { timeout: txConfirmationTimeout }).should('be.not.visible');
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find(ss.transactionAddress).should('have.text', 'Second passphrase registration');
    cy.get('@tx').find(ss.transactionAmountPlaceholder).should('have.text', '-');
    cy.get(ss.headerBalance).invoke('text').as('balanceAfter').then(() => {
      compareBalances(this.balanceBefore, this.balanceAfter, txSecondPassphraseRegCost);
    });
  });

  /**
   * Try to register with insufficient balance
   * @expect choose name button is disabled
   * @expect error message
   */
  it('Try to register with insufficient balance', () => {
    cy.autologin(accounts['empty account'].passphrase, networks.devnet.node);
    cy.visit(urls.secondPassphrase);
    cy.url().should('contain', urls.settings);
    cy.get(ss.secondPassphraseSettingsSection).contains('You don’t have enough balance to enable it.');
  });
});
