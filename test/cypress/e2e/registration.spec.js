import networks from '../../constants/networks';
import chooseNetwork from '../utils/chooseNetwork';

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

const registerUrl = '/register';

/**
 * Generates a sequence of random pairs of x,y coordinates on the screen that simulates
 * the movement of mouse to produce a pass phrase.
 */
const moveMouseRandomly = () => {
  for (let i = 0; i < 70; i += 1) {
    cy.get('main').first().trigger('mousemove', {
      which: 1,
      pageX: 500 + (Math.floor((((i % 2) * 2) - 1) * (249 + (Math.random() * 250)))),
      pageY: 500 + (Math.floor((((i % 2) * 2) - 1) * (249 + (Math.random() * 250)))),
    });
  }
};

const registerUI = function () {
  moveMouseRandomly();
  cy.get(ss.getPassphraseButton).click();
  cy.get(ss.iUnderstandCheckbox).click();
  cy.get(ss.revealCheckbox)
    .trigger('mousedown')
    .trigger('mousemove', { which: 1, pageX: 100, pageY: 0 })
    .trigger('mouseup');
  cy.get(ss.passphraseTextarea).invoke('text').as('passphrase');
  cy.get(ss.itsSafeBtn).click();
  cy.get(ss.passphraseWordHolder).each(($el) => {
    if (this.passphrase.includes($el[0].textContent)) cy.wrap($el).click();
  });
  cy.get(ss.getToDashboardBtn).click();
};

describe('Registration', () => {
  it(`Opens by url ${registerUrl}`, () => {
    cy.visit(registerUrl);
    cy.url().should('contain', 'register');
    cy.get(ss.backButton);
  });

  it('Create Lisk ID for Mainnet by default ("Switch Network" is not set)', function () {
    cy.visit(registerUrl);
    registerUI.call(this);
    cy.get(ss.networkStatus).should('not.exist');
  });

  it('Create Lisk ID for Mainnet ("Switch Network" is false)', function () {
    cy.addLocalStorage('settings', 'showNetwork', false);
    cy.visit(registerUrl);
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
