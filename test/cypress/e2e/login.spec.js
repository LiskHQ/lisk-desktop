import numeral from 'numeral';
import { fromRawLsk } from '../../../src/utils/lsk';
import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import ss from '../../constants/selectors';
import urls from '../../constants/urls';
import chooseNetwork from '../utils/chooseNetwork';

const loginUI = (passphrase) => {
  cy.get(ss.passphraseInput).click();
  cy.get(ss.passphraseInput).each(($el, index) => {
    const passphraseWordsArray = passphrase.split(' ');
    cy.wrap($el).type(passphraseWordsArray[index]);
  });
  cy.get(ss.loginBtn).click();
};

const castNumberToBalanceString = number => numeral(fromRawLsk(number)).format('0,0.[0000000000000]');

describe('Login Page', () => {
  /**
   * 'Create lisk id' link leads to registration page
   * @expect some specific to page element is present on it
   */
  it('Create lisk id -> Register account page', () => {
    cy.visit('/');
    cy.get(ss.createLiskIdBtn).click();
    cy.url().should('include', urls.register);
    cy.get(ss.app).contains('Create your Lisk ID');
  });

  /**
   * First time app is opened sign in happens to mainnet
   * @expect address matches
   * @expect 0 balance - otherwise you've just found free money
   * @expect network status is not shown
   */
  it('Log in to Mainnet by default ("Switch Network" is not set)', () => {
    cy.visit('/');
    loginUI(accounts.genesis.passphrase);
    cy.get(ss.headerAddress).should('have.text', accounts.genesis.address);
    cy.get(ss.headerBalance).should('have.text', castNumberToBalanceString(0));
    cy.get(ss.networkStatus).should('not.exist');
  });

  /**
   * If the switch network is set to false sign in happens to mainnet
   * @expect address matches
   * @expect 0 balance - otherwise you've just found free money
   * @expect network status is not shown
   */
  it('Log in to Mainnet by default ("Switch Network" is false)', () => {
    cy.addLocalStorage('settings', 'showNetwork', false);
    cy.visit('/');
    loginUI(accounts.genesis.passphrase);
    cy.get(ss.headerAddress).should('have.text', accounts.genesis.address);
    cy.get(ss.headerBalance).should('have.text', castNumberToBalanceString(0));
    cy.get(ss.networkStatus).should('not.exist');
  });

  /**
   * If the switch network is set to true and mainnet is chosen sign in happens to mainnet
   * @expect address matches
   * @expect 0 balance - otherwise you've just found free money
   * @expect network status shows mainnet
   */
  it('Log in to Mainnet (Selected network)', () => {
    cy.addLocalStorage('settings', 'showNetwork', true);
    cy.visit('/');
    chooseNetwork('main');
    loginUI(accounts.genesis.passphrase);
    cy.get(ss.networkStatus).contains('Connected to mainnet');
    cy.get(ss.headerAddress).should('have.text', accounts.genesis.address);
    cy.get(ss.headerBalance).should('have.text', castNumberToBalanceString(0));
  });

  /**
   * If the switch network is set to true and testnet is chosen sign in happens to testnet
   * @expect address matches
   * @expect balance matches one specified in constants therefore please don't touch it :)
   * @expect network status shows testnet
   */
  it('Log in to Testnet', () => {
    cy.addLocalStorage('settings', 'showNetwork', true);
    cy.visit('/');
    chooseNetwork('test');
    loginUI(accounts['testnet guy'].passphrase);
    cy.get(ss.networkStatus).contains('Connected to testnet');
    cy.get(ss.headerAddress).should('have.text', accounts['testnet guy'].address);
    cy.get(ss.headerBalance).should('have.text', castNumberToBalanceString(accounts['testnet guy'].balance));
  });

  /**
   * If the switch network is set to true, devnet is chosen and custom node is specified,
   * sign in happens to testnet
   * @expect address matches
   * @expect balance's three leading numbers match specified in constants
   * @expect network status shows devnet
   */
  it('Log in to Devnet', () => {
    cy.addLocalStorage('settings', 'showNetwork', true);
    cy.visit('/');
    chooseNetwork('dev');
    loginUI(accounts.genesis.passphrase);
    cy.get(ss.networkStatus).contains('Connected to devnet');
    cy.get(ss.headerAddress).should('have.text', accounts.genesis.address);
    cy.get(ss.headerBalance).should('contain', castNumberToBalanceString(accounts.genesis.balance).substring(0, 3));
    cy.get(ss.nodeAddress).contains(networks.devnet.node);
  });

  /**
   * ?showNetwork URL parameter makes network switcher available
   * @expect network switcher is visible
   */
  it('Network switcher available by url ?showNetwork=true', () => {
    cy.visit('?showNetwork=true');
    cy.get(ss.networkDropdown).should('be.visible');
  });

  /**
   * Try to sign in to invalid custom node address
   * @expect error popup is shown
   */
  it('Log in to invalid address', () => {
    cy.addLocalStorage('settings', 'showNetwork', true);
    cy.visit('/');
    chooseNetwork('invalid');
    loginUI(accounts.genesis.passphrase);
    cy.get(ss.errorPopup).contains('Unable to connect to the node');
  });
});
