import urls from '../../constants/urls';
import ss from '../../constants/selectors';

describe('Registration', () => {
  /**
   * Create an account
   * @expect Account is created
   */
  it('Create an account', function () {
    cy.visit(urls.register);
    cy.url().should('contain', 'register');
    cy.get(ss.chooseAvatar).first().click();
    cy.get(ss.getPassphraseButton).click();
    this.passphrase = [];
    cy.get(ss.copyPassphrase).each(($el) => {
      this.passphrase = [...this.passphrase, $el.val()];
    });
    cy.get(ss.itsSafeBtn).click();
    cy.get(ss.passphraseWordConfirm).each(($el) => {
      if (this.passphrase.includes($el[0].textContent)) cy.wrap($el).click();
    });
    cy.get(ss.passphraseConfirmButton).click();
    cy.get(ss.loginBtn).click();
  });
});
