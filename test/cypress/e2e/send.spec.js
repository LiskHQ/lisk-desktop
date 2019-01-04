import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';
import enterSecondPassphrase from '../utils/enterSecondPassphrase';
import compareBalances from '../utils/compareBalances';

const msg = {
  transferTxSuccess: 'Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain.',
  accountInitializatoinAddress: 'Account initialization',
};

const txConfirmationTimeout = 12000;

const checkWalletPageLoaded = () => cy.get(ss.recipientInput);

const getRandomAddress = () => `23495548666${Math.floor((Math.random() * 8990000) + 1000000)}L`;
const getRandomAmount = () => Math.floor((Math.random() * 10) + 1);
const getRandomReference = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

const transactionFee = 0.1;

describe('Send', () => {
  let randomAddress;
  let randomAmount;
  let randomReference;

  beforeEach(() => {
    randomAddress = getRandomAddress();
    randomAmount = getRandomAmount();
    randomReference = getRandomReference();
  });

  /**
   * Wallet page can be opened by direct link
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  it(`Wallet page opens by url ${urls.wallet}`, () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.url().should('contain', urls.wallet);
    cy.get(ss.transactionSendButton).click();
    checkWalletPageLoaded();
  });

  /**
   * Sidebar link leads to Wallet page
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  it('Wallet page opens by sidebar button', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.dashboard);
    cy.get(ss.sidebarMenuWalletBtn).should('have.css', 'opacity', '1').click();
    cy.url().should('contain', urls.wallet);
    cy.get(ss.transactionSendButton).click();
    checkWalletPageLoaded();
  });

  /**
   * Make a transfer with empty reference
   * @expect successfully go through transfer process
   * @expect transaction appears in the activity list as pending
   * @expect transaction appears in the activity list with correct data
   * @expect transaction appears in the activity list as confirmed
   * @expect header balance value is decreased
   */
  it('Transfer tx with empty ref appears in activity pending -> approved,' +
    'Header balance is affected', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.send);
    cy.get(ss.headerBalance).invoke('text').as('balanceBefore');
    cy.get(ss.recipientInput).type(randomAddress);
    cy.get(ss.amountInput).click().type(randomAmount);
    cy.get(ss.nextTransferBtn).click();
    cy.get(ss.sendBtn).click();
    cy.get(ss.resultMessage).should('have.text', msg.transferTxSuccess);
    cy.get(ss.okayBtn).click();
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find('.spinner');
    cy.get('@tx').find(ss.transactionAddress).should('have.text', randomAddress);
    cy.get('@tx').find(ss.transactionReference).should('have.text', '-');
    cy.get('@tx').find(ss.transactionAmount).should('have.text', randomAmount.toString());
    cy.wait(txConfirmationTimeout);
    cy.get('@tx').find(ss.spinner).should('not.exist');
    cy.get(ss.headerBalance).invoke('text').as('balanceAfter').then(function () {
      compareBalances(this.balanceBefore, this.balanceAfter, randomAmount + transactionFee);
    });
  });

  /**
   * Make a transfer with reference
   * @expect successfully go through transfer process
   * @expect transaction appears in the activity list as pending
   * @expect transaction appears in the activity list with correct data
   * @expect transaction appears in the activity list as confirmed
   */
  it('Transfer tx with ref appears in dashboard activity pending -> approved', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.send);
    cy.get(ss.recipientInput).type(randomAddress);
    cy.get(ss.referenceInput).click().type(randomReference);
    cy.get(ss.amountInput).click().type(randomAmount);
    cy.get(ss.nextTransferBtn).click();
    cy.get(ss.sendBtn).click();
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

  /**
   * Make a transfer with second passphrase
   * @expect successfully go through transfer process
   * @expect transaction appears in the activity list as pending
   * @expect transaction appears in the activity list with correct data
   * @expect transaction appears in the activity list as confirmed
   */
  it('Transfer tx with second passphrase', () => {
    cy.autologin(accounts['second passphrase account'].passphrase, networks.devnet.node);
    cy.visit(urls.send);
    cy.get(ss.recipientInput).type(randomAddress);
    cy.get(ss.referenceInput).click().type(randomReference);
    cy.get(ss.amountInput).click().type(randomAmount);
    cy.get(ss.nextTransferBtn).click();
    enterSecondPassphrase(accounts['second passphrase account'].secondPassphrase);
    cy.get(ss.sendBtn).click();
    cy.get(ss.resultMessage).should('have.text', msg.transferTxSuccess);
    cy.get(ss.okayBtn).click();
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find('.spinner');
    cy.get('@tx').find(ss.transactionAddress).should('have.text', randomAddress);
  });

  /**
   * Shortcut URL prefills recipient, amount and reference
   * @expect recipient, amount and reference are prefilled
   */
  it('Launch protocol link prefills recipient, amount and reference', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.send}/?recipient=4995063339468361088L&amount=5&reference=test`);
    cy.get(ss.recipientInput).should('have.value', '4995063339468361088L');
    cy.get(ss.amountInput).should('have.value', '5');
    cy.get(ss.referenceInput).should('have.value', 'test');
  });

  /**
   * Fiat converter shows amount in USD if set to USD
   * @expect amount in USD
   */
  it('Fiat converter shows amount in USD', () => {
    cy.addLocalStorage('settings', 'currency', 'USD');
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.send}?recipient=4995063339468361088L&amount=5`);
    cy.get(ss.convertedPrice).contains(/^\d{1,100}(\.\d{1,2})? USD$/);
  });

  /**
   * Fiat converter shows amount in EUR if set to EUR
   * @expect amount in EUR
   */
  it('Fiat converter shows amount in EUR', () => {
    cy.addLocalStorage('settings', 'currency', 'EUR');
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.send}?recipient=4995063339468361088L&amount=5`);
    cy.get(ss.convertedPrice).contains(/^\d{1,100}(\.\d{1,2})? EUR$/);
  });

  /**
   * Initialization dialogue and functionality is shown for the fresh account
   * @expect successfully go through initialization
   * @expect transfer transaction appear with correct data
   * @expect initialization dialogue is not shown anymore
   */
  it('Should be able to init account when needed', () => {
    cy.autologin(accounts['without initialization'].passphrase, networks.devnet.node);
    cy.reload();
    cy.visit(urls.send);
    cy.get(ss.accountInitializationMsg).get(ss.accountInitializationBtn).click();
    cy.get(ss.sendBtn).click();
    cy.get(ss.resultMessage).should('have.text', msg.transferTxSuccess);
    cy.get(ss.accountInitializationMsg).should('not.exist');
    cy.wait(txConfirmationTimeout);
    cy.reload();
    cy.visit(urls.send);
    cy.get(ss.accountInitializationMsg).should('not.exist');
    cy.visit(urls.wallet);
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find(ss.transactionAddress).should('have.text', accounts['without initialization'].address);
    cy.get('@tx').find(ss.transactionReference).should('have.text', 'Account initialization');
  });

  /**
   * Try to make a transfer if not enough funds
   * @expect next button is disabled
   * @expect error message shown
   */
  it('It\'s not allowed to make a transfer if not enough funds', () => {
    cy.autologin(accounts['empty account'].passphrase, networks.devnet.node);
    cy.visit(urls.send);
    cy.get(ss.recipientInput).type(randomAddress);
    cy.get(ss.amountInput).click().type(randomAmount);
    cy.get(ss.nextTransferBtn).should('be.disabled');
    cy.get(ss.amountInput).parent().contains('Not enough LSK');
  });

  /**
   * Make a transfer which will fail
   * @expect status code and error message are shown
   */
  it('Error message is shown if transfer tx fails', () => {
    cy.server({ status: 409 });
    cy.route('POST', '/api/transactions', { message: 'Test error' });
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.send);
    cy.get(ss.recipientInput).type(randomAddress);
    cy.get(ss.amountInput).click().type(randomAmount);
    cy.get(ss.nextTransferBtn).click();
    cy.get(ss.sendBtn).click();
    cy.get(ss.resultMessage).contains('Status 409 : Test error');
  });
});
