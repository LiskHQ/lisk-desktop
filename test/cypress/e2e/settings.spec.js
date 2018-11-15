import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';

const ss = {
  sidebarMenuSettingsBtn: '#settings',
  registerSecondPassphraseBtn: '.register-second-passphrase',
  secondPassphraseIsRegisteredLabel: '.second-passphrase-registered',
  currencyUSDBtn: '.currency-USD',
  currencyEURBtn: '.currency-EUR',
  autoLogoutTrigger: '.autoLog',
  switchNetworksTrigger: '.showNetwork',
  delegateFeaturesTrigger: '.advancedMode',
};

const checkSettingsPageLoaded = () => cy.get('.showNetwork');

const getSettingsObjFromLS = () => JSON.parse(localStorage.getItem('settings'));

describe('Settings', () => {
  it(`opens by url ${urls.settings}`, () => {
    cy.visit(urls.settings);
    cy.url().should('contain', 'setting');
    checkSettingsPageLoaded();
  });

  it('opens by sidebar button', () => {
    cy.visit('/');
    cy.get(ss.sidebarMenuSettingsBtn).should('have.css', 'opacity', '1').click();
    cy.url().should('contain', 'setting');
    checkSettingsPageLoaded();
  });

  it('second passphrase registration is disabled if not logged in', () => {
    cy.visit(urls.settings);
    cy.get(ss.registerSecondPassphraseBtn).should('have.class', 'disabled');
  });

  it('second passphrase Register -> Second passphrase page', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.settings);
    cy.get(ss.registerSecondPassphraseBtn).should('not.have.class', 'disabled').click();
    cy.url().should('contain', 'second-passphrase');
  });

  it('second passphrase registration is disabled if already registered', () => {
    cy.autologin(accounts['second passphrase account'].passphrase, networks.devnet.node);
    cy.visit(urls.settings);
    cy.get(ss.secondPassphraseIsRegisteredLabel).should('be.visible');
  });

  [
    ss.autoLogoutTrigger,
    ss.switchNetworksTrigger,
    ss.delegateFeaturesTrigger,
  ]
    .forEach((selector) => {
      it(`${selector.substr(1)} default position is off and can be toggled to on and back`, () => {
        cy.visit(urls.settings);
        cy.get(`${selector}`).click().should(() => {
          expect(getSettingsObjFromLS()[`${selector.substr(1)}`]).to.equal(true);
        });
        cy.get(`${selector}`).click().should(() => {
          expect(getSettingsObjFromLS()[`${selector.substr(1)}`]).to.equal(false);
        });
      });
    });

  it('currency default position should be USD and can be toggled to USD and back', () => {
    cy.visit(urls.settings);
    cy.get(ss.currencyUSDBtn).should('have.class', 'active');
    cy.get(ss.currencyEURBtn).click().should(($button) => {
      expect($button).to.have.class('active');
      expect(getSettingsObjFromLS().currency).to.equal('EUR');
    });
    cy.get(ss.currencyUSDBtn).click().should(($button) => {
      expect($button).to.have.class('active');
      expect(getSettingsObjFromLS().currency).to.equal('USD');
    });
  });
});
