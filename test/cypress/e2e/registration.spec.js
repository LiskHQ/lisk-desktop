import networks from '../../constants/networks';
import urls from '../../constants/urls';
import chooseNetwork from '../utils/chooseNetwork';
import moveMouseRandomly from '../utils/moveMouseRandomly';
import slideCheckbox from '../utils/slideCheckbox';

const ss = {
  networkStatus: '.network-status',
  newAccountBtn: '.new-account-button',
  nodeAddress: '.peer',
  errorPopup: '.toast',
  getPassphraseButton: '.get-passphrase-button',
  iUnderstandCheckbox: '.i-understand-checkbox',
  revealCheckbox: '.reveal-checkbox',
  passphraseTextarea: 'textarea.passphrase',
  itsSafeBtn: '.yes-its-safe-button',
  passphraseWordHolder: '.passphrase-holder label',
  getToDashboardBtn: '.get-to-your-dashboard-button',
  backButton: '.multistep-back',
};

const registerUI = function () {
  moveMouseRandomly();
  cy.get(ss.getPassphraseButton).click();
  cy.get(ss.iUnderstandCheckbox).click();
  slideCheckbox();
  cy.get(ss.passphraseTextarea).invoke('text').as('passphrase');
  cy.get(ss.itsSafeBtn).click();
  cy.get(ss.passphraseWordHolder).each(($el) => {
    if (this.passphrase.includes($el[0].textContent)) cy.wrap($el).click();
  });
  cy.get(ss.getToDashboardBtn).click();
};

describe('Registration', () => {
  it(`Opens by url ${urls.register}`, () => {
    cy.visit(urls.register);
    cy.url().should('contain', 'register');
    cy.get(ss.backButton);
  });

  it('Create Lisk ID for Mainnet by default ("Switch Network" is not set)', function () {
    cy.visit(urls.register);
    registerUI.call(this);
    cy.get(ss.networkStatus).should('not.exist');
  });

  it('Create Lisk ID for Mainnet ("Switch Network" is false)', function () {
    cy.addLocalStorage('settings', 'showNetwork', false);
    cy.visit(urls.register);
    registerUI.call(this);
    cy.get(ss.networkStatus).should('not.exist');
  });

  it('Create Lisk ID for Mainnet (Selected network)', function () {
    cy.addLocalStorage('settings', 'showNetwork', true);
    cy.visit('/');
    chooseNetwork('main');
    cy.get(ss.newAccountBtn).click();
    registerUI.call(this);
    cy.get(ss.networkStatus).contains('Connected to mainnet');
  });

  it('Create Lisk ID for Testnet', function () {
    cy.addLocalStorage('settings', 'showNetwork', true);
    cy.visit('/');
    chooseNetwork('test');
    cy.get(ss.newAccountBtn).click();
    registerUI.call(this);
    cy.get(ss.networkStatus).contains('Connected to testnet');
  });

  // TODO: unskip after #1326 fixed
  it.skip('Create Lisk ID for Devnet', function () {
    cy.addLocalStorage('settings', 'showNetwork', true);
    cy.visit('/');
    chooseNetwork('dev');
    cy.get(ss.newAccountBtn).click();
    registerUI.call(this);
    cy.get(ss.networkStatus).contains('Connected to devnet');
    cy.get(ss.nodeAddress).contains(networks.devnet.node);
  });

  // TODO: unskip after #1326 fixed
  it.skip('Create Lisk ID for invalid address', function () {
    cy.addLocalStorage('settings', 'showNetwork', true);
    cy.visit('/');
    chooseNetwork('invalid');
    cy.get(ss.newAccountBtn).click();
    registerUI.call(this);
    cy.get(ss.errorPopup).contains('Unable to connect to the node');
  });
});
