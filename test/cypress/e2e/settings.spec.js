import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import ss from '../../constants/selectors';
import urls from '../../constants/urls';

const checkSettingsPageLoaded = () => cy.get(ss.switchNetworksTrigger);

const getSettingsObjFromLS = () => JSON.parse(localStorage.getItem('settings'));

describe('Settings', () => {
  /**
   * Settings page can be opened by direct link
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  it(`Opens by url ${urls.settings}`, () => {
    cy.visit(urls.settings);
    cy.url().should('contain', urls.settings);
    checkSettingsPageLoaded();
  });

  /**
   * Settings page can be opened clicking avatar and than settings button
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  it('Opens by button', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit('/');
    cy.get(ss.userAvatar).click();
    cy.get(ss.settingsBtn).click();
    cy.url().should('contain', urls.settings);
    checkSettingsPageLoaded();
  });

  /**
   * Second passphrase registration is not available if not logged in
   * @expect link is disabled
   */
  it('Second passphrase registration is disabled if not logged in', () => {
    cy.visit(urls.settings);
    cy.get(ss.registerSecondPassphraseBtn).should('have.class', 'disabled');
  });

  /**
   * Second passphrase registration link leads to second passphrase registration page
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  // TODO figure out what is wrong, fix it and enable this test
  // https://dashboard.cypress.io/#/projects/528xi2/runs/399/specs
  it.skip('Second passphrase Register -> Second passphrase page', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.settings);
    cy.get(ss.registerSecondPassphraseBtn).should('not.have.class', 'disabled').click();
    cy.url().should('contain', urls.secondPassphrase);
    cy.get(ss.app).contains('Secure the use of your Lisk ID');
  });

  /**
   * Second passphrase registration is not available if one already have it registered
   * @expect already registered label is there
   */
  it('Second passphrase registration is disabled if already registered', () => {
    cy.autologin(accounts['second passphrase account'].passphrase, networks.devnet.node);
    cy.visit(urls.settings);
    cy.get(ss.secondPassphraseIsRegisteredLabel).should('be.visible');
  });

  [
    ss.switchNetworksTrigger,
  ]
    .forEach((selector) => {
      /**
       * Feature toggle default state is off and clicking toggles on and off
       * @expect corresponding localStorage setting toggles true/false
       */
      it(`${selector.substr(1)} default position is off and can be toggled to on and back`, () => {
        cy.clearLocalStorage();
        cy.visit(urls.settings);
        cy.get(`${selector}`).click().should(() => {
          expect(getSettingsObjFromLS()[`${selector.substr(1)}`]).to.equal(true);
        });
        cy.get(`${selector}`).click().should(() => {
          expect(getSettingsObjFromLS()[`${selector.substr(1)}`]).to.equal(false);
        });
      });
    });

  /**
   * Currency switch default state is USD and is changeable to EUR and Back
   * @expect corresponding localStorage setting changes to USD/EUR
   */
  it('Currency default position should be USD and can be toggled to USD and back', () => {
    cy.clearLocalStorage();
    cy.visit(urls.settings);
    cy.get(ss.currencySelect).click();
    cy.get(ss.currencyOptions).eq(1).click().should(() => {
      expect(getSettingsObjFromLS().currency).to.equal('EUR');
    });
    cy.get(ss.currencySelect).click();
    cy.get(ss.currencyOptions).eq(0).click().should(() => {
      expect(getSettingsObjFromLS().currency).to.equal('USD');
    });
  });
});
