import networks from '../../constants/networks';
import ss from '../../constants/selectors';
import urls from '../../constants/urls';

describe('Splashscreen', () => {
  /**
   * 'Sign in' link leads to login page
   * @expect some specific to page element is present on it
   */
  it('Sign in -> Login page', () => {
    cy.visit('/');
    cy.get(ss.loginBtn).click();
    cy.url().should('include', urls.login);
    cy.get(ss.app).contains('Sign in with a Passphrase');
  });
  /**
   * 'Create an account' link leads to registration page
   * @expect some specific to page element is present on it
   */
  it('Create an account -> Register page', () => {
    cy.visit('/');
    cy.get(ss.createLiskIdBtn).click();
    cy.url().should('include', urls.register);
    cy.get(ss.app).contains('Choose your Avatar');
  });

  it('Explore as guest connects to mainnet by default', () => {
    cy.addObjectToLocalStorage('settings', 'showNetwork', true);
    cy.visit('/');
    cy.get(ss.exploreAsGuestBtn).click();
    cy.url().should('include', urls.dashboard);
    cy.get(ss.networkStatus).contains('mainnet');
  });

  it('Explore as guest connects to last used', () => {
    cy.addToLocalStorage('liskCoreUrl', networks.testnet.nodes[0]);
    cy.visit('/');
    cy.get(ss.exploreAsGuestBtn).click();
    cy.url().should('include', urls.dashboard);
    cy.get(ss.networkStatus).contains('testnet');
  });

  it('Settings button', () => {
    cy.visit('/');
    cy.get(ss.app).contains('Settings').click();
    cy.url().should('contain', urls.settings);
    cy.get(ss.switchNetworksTrigger);
  });
});

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
