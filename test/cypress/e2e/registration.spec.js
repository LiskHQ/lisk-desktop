import urls from '../../constants/urls';
import ss from '../../constants/selectors';

const registerUI = function () {
  cy.get(ss.chooseAvatar).first().click();
  cy.get(ss.getPassphraseButton).click();
  cy.get(ss.copyPassphrase).invoke('text').as('passphrase');
  cy.get(ss.itsSafeBtn).click();
  cy.get(ss.passphraseWordConfirm).each(($el) => {
    if (this.passphrase.includes($el[0].textContent)) cy.wrap($el).click();
  });
  cy.get(ss.passphraseConfirmButton).click();
  cy.get(ss.loginBtn).click();
};

describe('Registration', () => {
  /**
   * Registration page can be opened by direct link
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  it(`Opens by url ${urls.register}`, () => {
    cy.visit(urls.register);
    cy.url().should('contain', 'register');
    cy.get(ss.app).contains('Choose your Avatar');
  });

  /**
   * Create Lisk ID
   * @expect Lisk ID is created
   */
  it('Create Lisk ID', function () {
    cy.visit(urls.register);
    registerUI.call(this);
  });
});
