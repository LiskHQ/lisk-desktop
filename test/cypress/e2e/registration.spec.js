import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';
import chooseNetwork from '../utils/chooseNetwork';
import moveMouseRandomly from '../utils/moveMouseRandomly';
import slideCheckbox from '../utils/slideCheckbox';

const registerUI = function () {
  moveMouseRandomly();
  cy.get(ss.getPassphraseButton).click();
  cy.get(ss.iUnderstandCheckbox).click();
  slideCheckbox(ss.revealCheckbox);
  cy.get(ss.passphraseTextarea).invoke('text').as('passphrase');
  cy.get(ss.itsSafeBtn).click();
  cy.get(ss.passphraseWordHolder).each(($el) => {
    if (this.passphrase.includes($el[0].textContent)) cy.wrap($el).click();
  });
  cy.get(ss.getToDashboardBtn).click();
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
    cy.get(ss.app).contains('Create your Lisk ID');
  });

  /**
   * Create Lisk ID for Mainnet by default ("Switch Network" is not set)
   * @expect network status is not shown
   */
  it('Create Lisk ID for Mainnet by default ("Switch Network" is not set)', function () {
    cy.visit(urls.register);
    registerUI.call(this);
    cy.get(ss.networkStatus).should('not.exist');
  });

  /**
   * Create Lisk ID for Mainnet by default ("Switch Network" is false)
   * @expect network status is not shown
   */
  it('Create Lisk ID for Mainnet ("Switch Network" is false)', function () {
    cy.addLocalStorage('settings', 'showNetwork', false);
    cy.visit(urls.register);
    registerUI.call(this);
    cy.get(ss.networkStatus).should('not.exist');
  });

  /**
   * Create Lisk ID for Mainnet
   * @expect network status shows mainnet
   */
  it('Create Lisk ID for Mainnet', function () {
    cy.addLocalStorage('settings', 'showNetwork', true);
    cy.visit('/');
    chooseNetwork('main');
    cy.get(ss.createLiskIdBtn).click();
    registerUI.call(this);
    cy.get(ss.networkStatus).contains('Connected to mainnet');
  });

  /**
   * Create Lisk ID for Testnet
   * @expect network status shows testnet
   */
  it('Create Lisk ID for Testnet', function () {
    cy.addLocalStorage('settings', 'showNetwork', true);
    cy.visit('/');
    chooseNetwork('test');
    cy.get(ss.createLiskIdBtn).click();
    registerUI.call(this);
    cy.get(ss.networkStatus).contains('Connected to testnet');
  });

  /**
   * Create Lisk ID for Devnet
   * @expect network status shows devnet
   */
  it('Create Lisk ID for Devnet', function () {
    cy.addLocalStorage('settings', 'showNetwork', true);
    cy.visit('/');
    chooseNetwork('dev');
    cy.get(ss.createLiskIdBtn).click();
    registerUI.call(this);
    cy.get(ss.networkStatus).contains('Connected to devnet');
    cy.get(ss.nodeAddress).contains(networks.devnet.node);
  });

  /**
   * Try Create Lisk ID with invalid address entered
   * @expect error shown
   */
  it('Create Lisk ID for invalid address', () => {
    cy.addLocalStorage('settings', 'showNetwork', true);
    cy.visit('/');
    chooseNetwork('invalid');
    cy.get(ss.createLiskIdBtn).click();
    cy.get(ss.errorPopup).contains('Unable to connect to the node');
    cy.get(ss.createLiskIdBtn);
  });
});
