import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import enterSecondPassphrase from '../utils/enterSecondPassphrase';

const ss = {
  sidebarMenuWalletBtn: '#transactions',
  recipientInput: '.recipient input',
  amountInput: '.amount input',
  referenceInput: '.reference input',
  convertorElement: '.convertor',
  convertedPrice: '.converted-price',
  nextButton: '.send-next-button',
  sendButton: '.send-button',
  secondPassphraseInput: '.second-passphrase input',
  secondPassphraseNextBtn: '.second-passphrase-next',
  resultMessage: '.result-box-message',
  okayBtn: '.okay-button',
  transactoinsTable: '.transaction-results',
  transactionRow: '.transactions-row',
  accountInitializationMsg: '.account-initialization',
  accountInitializationBtn: '.account-init-button',
  spinner: '.spinner',
  transactionAddress: '.transaction-address span',
  transactionReference: '.transaction-reference',
  transactionAmount: '#transactionAmount span',
  headerBalance: '.balance span',
};

const msg = {
  transferTxSuccess: 'Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain.',
  accountInitializatoinAddress: 'Account initialization',
};

const txConfirmationTimeout = 12000;

const checkWalletPageLoaded = () => cy.get(ss.recipientInput);

const getRandomAddress = () => `23495548666${Math.floor((Math.random() * 8990000) + 1000000)}L`;
const getRandomAmount = () => Math.floor((Math.random() * 100) + 1);
const getRandomReference = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

const castBalanceStringToNumber = number => parseFloat(number.replace(/,/g, ''));

describe('Transfer', () => {
  let randomAddress;
  let randomAmount;
  let randomReference;
  const transactionFee = 0.1;

  beforeEach(() => {
    randomAddress = getRandomAddress();
    randomAmount = getRandomAmount();
    randomReference = getRandomReference();
  });

  it(`Wallet page opens by url ${urls.wallet}`, () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.url().should('contain', 'wallet');
    checkWalletPageLoaded();
  });

  it('Wallet page opens by sidebar button', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit('/dashboard');
    cy.wait(100);
    cy.get(ss.sidebarMenuWalletBtn).click();
    cy.url().should('contain', 'wallet');
    checkWalletPageLoaded();
  });

  it('Transfer tx with empty ref appears in activity pending -> approved,' +
    'Header balance is affected', function () {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.headerBalance).invoke('text').as('balanceBeforeString');
    cy.get(ss.recipientInput).type(randomAddress);
    cy.get(ss.amountInput).click().type(randomAmount);
    cy.get(ss.nextButton).click();
    cy.get(ss.sendButton).click();
    cy.get(ss.resultMessage).should('have.text', msg.transferTxSuccess);
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find('.spinner');
    cy.get('@tx').find(ss.transactionAddress).should('have.text', randomAddress);
    cy.get('@tx').find(ss.transactionReference).should('have.text', '-');
    cy.get('@tx').find(ss.transactionAmount).should('have.text', randomAmount.toString());
    cy.wait(txConfirmationTimeout);
    cy.get('@tx').find(ss.spinner).should('not.exist');
    cy.get(ss.headerBalance).should((headerBalance) => {
      const balanceAfter = castBalanceStringToNumber(headerBalance.text());
      const balanceBefore = castBalanceStringToNumber(this.balanceBeforeString);
      expect(balanceAfter)
        .to.be.equal(parseFloat((balanceBefore - (randomAmount + transactionFee)).toFixed(6)));
    });
  });

  it('Transfer tx with ref appears in dashboard activity pending -> approved', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.recipientInput).type(randomAddress);
    cy.get(ss.referenceInput).click().type(randomReference);
    cy.get(ss.amountInput).click().type(randomAmount);
    cy.get(ss.nextButton).click();
    cy.get(ss.sendButton).click();
    cy.get(ss.resultMessage).should('have.text', msg.transferTxSuccess);
    cy.visit(urls.dashboard);
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find(ss.spinner);
    cy.get('@tx').find(ss.transactionAddress).should('have.text', randomAddress);
    cy.get('@tx').find(ss.transactionReference).should('have.text', randomReference);
    cy.get('@tx').find(ss.transactionAmount).should('have.text', randomAmount.toString());
    cy.wait(txConfirmationTimeout);
    cy.get('@tx').find(ss.spinner).should('not.exist');
  });

  it('Transfer tx with second passphrase', () => {
    cy.autologin(accounts['second passphrase account'].passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.recipientInput).type(randomAddress);
    cy.get(ss.referenceInput).click().type(randomReference);
    cy.get(ss.amountInput).click().type(randomAmount);
    cy.get(ss.nextButton).click();
    enterSecondPassphrase(accounts['second passphrase account'].secondPassphrase);
    cy.get(ss.sendButton).click();
    cy.get(ss.resultMessage).should('have.text', msg.transferTxSuccess);
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find('.spinner');
    cy.get('@tx').find(ss.transactionAddress).should('have.text', randomAddress);
  });

  it('Launch protocol link prefills recipient, amount and reference', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit('/wallet?recipient=4995063339468361088L&amount=5&reference=test');
    cy.get(ss.recipientInput).should('have.value', '4995063339468361088L');
    cy.get(ss.amountInput).should('have.value', '5');
    cy.get(ss.referenceInput).should('have.value', 'test');
  });

  it('Fiat converter shows amount in USD', () => {
    cy.addLocalStorage('settings', 'currency', 'USD');
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit('/wallet?recipient=4995063339468361088L&amount=5');
    cy.get(ss.convertedPrice).contains(/^\d{1,100}(\.\d{1,2})? USD$/);
  });

  it('Fiat converter shows amount in EUR', () => {
    cy.addLocalStorage('settings', 'currency', 'EUR');
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit('/wallet?recipient=4995063339468361088L&amount=5');
    cy.get(ss.convertedPrice).contains(/^\d{1,100}(\.\d{1,2})? EUR$/);
  });

  it('Should be able to init account when needed', () => {
    cy.autologin(accounts['without initialization'].passphrase, networks.devnet.node);
    cy.reload();
    cy.visit(urls.wallet);
    cy.get(ss.accountInitializationMsg).get(ss.accountInitializationBtn).click();
    cy.get(ss.sendButton).click();
    cy.get(ss.resultMessage).should('have.text', msg.transferTxSuccess);
    cy.get(ss.accountInitializationMsg).should('not.exist');
    cy.wait(txConfirmationTimeout);
    cy.reload();
    cy.get(ss.accountInitializationMsg).should('not.exist');
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find(ss.transactionAddress).should('have.text', accounts['without initialization'].address);
    cy.get('@tx').find(ss.transactionReference).should('have.text', 'Account initialization');
  });
});
