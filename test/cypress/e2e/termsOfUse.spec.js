import ss from '../../constants/selectors';

describe('Terms of use', () => {
  it('Are present on clean app start', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.get(ss.termsOfUse).click();
    cy.get(ss.loginBtn);
  });

  it('Are present app start if areTermsOfUseAccepted is false', () => {
    cy.addObjectToLocalStorage('settings', 'areTermsOfUseAccepted', false);
    cy.visit('/');
    cy.get(ss.termsOfUse).click();
    cy.get(ss.loginBtn);
  });

  it('Are present on /login route if areTermsOfUseAccepted is false', () => {
    cy.addObjectToLocalStorage('settings', 'areTermsOfUseAccepted', false);
    cy.visit('/login');
    cy.get(ss.termsOfUse).click();
    cy.get(ss.loginBtn);
  });
});
