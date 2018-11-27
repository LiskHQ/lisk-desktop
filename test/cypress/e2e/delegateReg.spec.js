import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import ss from '../../constants/selectors';
import urls from '../../constants/urls';
import enterSecondPassphrase from '../utils/enterSecondPassphrase';
import compareBalances from '../utils/compareBalances';

const txConfirmationTimeout = 12000;

const txDelegateRegPrice = 25;

const getRandomDelegateName = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

describe('Delegate Registration', () => {
  let randomDelegateName;

  beforeEach(() => {
    randomDelegateName = getRandomDelegateName();
  });

  /**
   * Delegate registration page can be opened by direct link
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  it(`Opens by url ${urls.registerDelegate}`, () => {
    cy.autologin(accounts['delegate candidate'].passphrase, networks.devnet.node);
    cy.visit(urls.registerDelegate);
    cy.url().should('contain', urls.registerDelegate);
    cy.get(ss.chooseDelegateName);
  });

  /**
   * Go through register delegate process
   * @expect transaction appears in the activity list in the confirmed state with valid details
   * @expect header balance value is decreased
   */
  it('Register delegate + Header balance is affected', function () {
    cy.autologin(accounts['delegate candidate'].passphrase, networks.devnet.node);
    cy.visit(urls.registerDelegate);
    cy.get(ss.headerBalance).invoke('text').as('balanceBefore');
    cy.get(ss.chooseDelegateName).click();
    cy.get(ss.delegateNameInput).click().type(randomDelegateName);
    cy.get(ss.submitDelagateNameBtn).click();
    cy.get(ss.confirmDelegateRegBtn).click();
    cy.wait(txConfirmationTimeout);
    cy.get(ss.app).contains('Success');
    cy.get(ss.goToDashboardAfterDelegateReg).click();
    cy.url().should('contain', urls.dashboard);
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find(ss.spinner).should('not.exist');
    cy.get('@tx').find(ss.transactionAddress).should('have.text', 'Delegate registration');
    cy.get('@tx').find(ss.transactionReference).should('have.text', '-');
    cy.get('@tx').find(ss.transactionAmountPlaceholder).should('have.text', '-');
    cy.get(ss.headerBalance).invoke('text').as('balanceAfter').then(() => {
      compareBalances(this.balanceBefore, this.balanceAfter, txDelegateRegPrice);
    });
  });

  /**
   * Go through register delegate process having 2ph set
   * @expect tx is in the list in confirmed state
   * @expect transaction appears in the activity list in the confirmed state with valid details
   */
  it('Register delegate with second passphrase', () => {
    cy.autologin(accounts['second passphrase account'].passphrase, networks.devnet.node);
    cy.visit(urls.registerDelegate);
    cy.get(ss.chooseDelegateName).click();
    cy.get(ss.delegateNameInput).click().type(randomDelegateName);
    cy.get(ss.submitDelagateNameBtn).click();
    enterSecondPassphrase(accounts['second passphrase account'].secondPassphrase);
    cy.get(ss.confirmDelegateRegBtn).click();
    cy.wait(txConfirmationTimeout);
    cy.get(ss.app).contains('Success');
    cy.get(ss.goToDashboardAfterDelegateReg).click();
    cy.url().should('contain', urls.dashboard);
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find(ss.spinner).should('not.exist');
    cy.get('@tx').find(ss.transactionAddress).should('have.text', 'Delegate registration');
    cy.get('@tx').find(ss.transactionReference).should('have.text', '-');
    cy.get('@tx').find(ss.transactionAmountPlaceholder).should('have.text', '-');
  });

  /**
   * Try to register already existing delegate name
   * @expect error message
   */
  it('Try to register already existing delegate name', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.registerDelegate);
    cy.get(ss.chooseDelegateName).click();
    cy.get(ss.delegateNameInput).click().type('genesis_51');
    cy.get(ss.delegateDuplicateNameError).should('have.text', 'Name is already taken!');
  });
});
