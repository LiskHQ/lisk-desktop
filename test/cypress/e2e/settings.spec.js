import accounts from '../../constants/accounts';
import networks from '../../constants/networks';

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

const settingsUrl = '/setting';

const checkSettingsPageLoaded = () => cy.get('.showNetwork');

const getSettingsObjFromLS = () => JSON.parse(localStorage.getItem('settings'));

describe('Settings', () => {
  it(`opens by url ${settingsUrl}`, () => {
    cy.visit(settingsUrl);
    cy.url().should('contain', 'setting');
    checkSettingsPageLoaded();
  });

  it('opens by sidebar button', () => {
    cy.visit('/');
    cy.get(ss.sidebarMenuSettingsBtn).click();
    cy.url().should('contain', 'setting');
    checkSettingsPageLoaded();
  });

  it('2nd passphrase registration is disabled if not logged in', () => {
    cy.visit(settingsUrl);
    cy.get(ss.registerSecondPassphraseBtn).should('have.class', 'disabled');
  });

  it('2nd passphrase Register -> Second passphrase page', () => {
    cy.login(accounts.genesis.passphrase, networks.mainnet.url);
    cy.visit(settingsUrl);
    cy.get(ss.registerSecondPassphraseBtn).should('not.have.class', 'disabled').click();
    cy.url().should('contain', 'second-passphrase');
  });

  it('2nd passphrase registration is disabled if already registered', () => {
    cy.login(accounts['second passphrase account'].passphrase, networks.devnet.url);
    cy.visit(settingsUrl);
    cy.get(ss.secondPassphraseIsRegisteredLabel).should('be.visible');
  });

  [
    ss.autoLogoutTrigger,
    ss.switchNetworksTrigger,
    ss.delegateFeaturesTrigger,
  ]
    .forEach((selector) => {
      it(`${selector.substr(1)} default position and toggling`, () => {
        cy.visit(settingsUrl);
        cy.get(`${selector}`).click().should(() => {
          expect(getSettingsObjFromLS()[`${selector.substr(1)}`]).to.equal(true);
        });
        cy.get(`${selector}`).click().should(() => {
          expect(getSettingsObjFromLS()[`${selector.substr(1)}`]).to.equal(false);
        });
      });
    });

  it('currency default position and toggling', () => {
    cy.visit(settingsUrl);
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
