import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import enterSecondPassphrase from '../utils/enterSecondPassphrase';

const ss = {
  nextButton: '.next',
  chooseName: '.choose-name',
  delegateNameInput: '.delegate-name input',
  submitDelagateNameBtn: '.submit-delegate-name',
  successText: '.success-description',
  goToDashboardAfterDelegateReg: '.registration-success',
  confirmDelegateRegBtn: '.confirm-delegate-registration',
  spinner: '.spinner',
  transactionRow: '.transactions-row',
  transactionAddress: '.transaction-address span',
  transactionReference: '.transaction-reference',
  transactionAmount: '#transactionAmount span',
  transactionAmountPlaceholder: '#transactionAmount',
  duplicateNameError: '.error-name-duplicate',
};

const txConfirmationTimeout = 12000;

const getRandomDelegateName = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

describe('Delegate Registration', () => {
  let randomDelegateName;

  beforeEach(() => {
    randomDelegateName = getRandomDelegateName();
  });

  it(`opens by url ${urls.registerDelegate}`, () => {
    cy.autologin(accounts['delegate candidate'].passphrase, networks.devnet.node);
    cy.visit(urls.registerDelegate);
    cy.url().should('contain', urls.registerDelegate);
    cy.get(ss.chooseName);
  });
  // TODO Add balance substraction check after #1391 is fixed
  it('register delegate', () => {
    cy.autologin(accounts['delegate candidate'].passphrase, networks.devnet.node);
    cy.visit(urls.registerDelegate);
    cy.get(ss.chooseName).click();
    cy.get(ss.delegateNameInput).click().type(randomDelegateName);
    cy.get(ss.submitDelagateNameBtn).click();
    cy.get(ss.confirmDelegateRegBtn).click();
    cy.wait(txConfirmationTimeout);
    cy.get('main').contains('Success');
    cy.get(ss.goToDashboardAfterDelegateReg).click();
    cy.url().should('contain', urls.dashboard);
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find(ss.spinner).should('not.exist');
    cy.get('@tx').find(ss.transactionAddress).should('have.text', 'Delegate registration');
    cy.get('@tx').find(ss.transactionReference).should('have.text', '-');
    cy.get('@tx').find(ss.transactionAmountPlaceholder).should('have.text', '-');
  });

  it('register delegate with second passphrase', () => {
    cy.autologin(accounts['second passphrase account'].passphrase, networks.devnet.node);
    cy.visit(urls.registerDelegate);
    cy.get(ss.chooseName).click();
    cy.get(ss.delegateNameInput).click().type(randomDelegateName);
    cy.get(ss.submitDelagateNameBtn).click();
    enterSecondPassphrase(accounts['second passphrase account'].secondPassphrase);
    cy.get(ss.confirmDelegateRegBtn).click();
    cy.wait(txConfirmationTimeout);
    cy.get('main').contains('Success');
    cy.get(ss.goToDashboardAfterDelegateReg).click();
    cy.url().should('contain', urls.dashboard);
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find(ss.spinner).should('not.exist');
    cy.get('@tx').find(ss.transactionAddress).should('have.text', 'Delegate registration');
    cy.get('@tx').find(ss.transactionReference).should('have.text', '-');
    cy.get('@tx').find(ss.transactionAmountPlaceholder).should('have.text', '-');
  });

  it('try to register already existing delegate name', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.registerDelegate);
    cy.get(ss.chooseName).click();
    cy.get(ss.delegateNameInput).click().type('genesis_51');
    cy.get(ss.duplicateNameError).should('have.text', 'Name is already taken!');
  });
});
