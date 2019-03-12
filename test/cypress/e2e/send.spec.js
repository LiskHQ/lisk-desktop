import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';
import { enterSecondPassphraseOnSend } from '../utils/enterSecondPassphrase';
import compareBalances from '../utils/compareBalances';
import loginUI from '../utils/loginUI';

const getFollowedAccountObjFromLS = () => JSON.parse(localStorage.getItem('followedAccounts'));

const msg = {
  transferTxSuccess: 'You will find it in My Transactions in a matter of minutes',
  accountInitializatoinAddress: 'Account initialization',
};

const txConfirmationTimeout = 12000;

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
   * Send page can be opened by direct link
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  it(`Send page opens by url ${urls.send}`, () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.send);
    cy.url().should('contain', urls.send);
    cy.get(ss.recipientInput);
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
    cy.get(ss.submittedTransactionMessage).should('have.text', msg.transferTxSuccess);
    cy.get(ss.okayBtn).click();
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find(ss.spinner).should('be.visible');
    cy.get('@tx').find(ss.transactionAddress).should('have.text', randomAddress);
    cy.get('@tx').find(ss.transactionAmount).should('have.text', randomAmount.toString());
    cy.wait(txConfirmationTimeout);
    cy.get('@tx').find(ss.spinner).should('be.not.visible');
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
    cy.get(ss.sendReferenceText).click().type(randomReference);
    cy.get(ss.amountInput).click().type(randomAmount);
    cy.get(ss.nextTransferBtn).click();
    cy.get(ss.recipientConfirmLabel).last().contains(randomAddress);
    cy.get(ss.referenceConfirmLabel).contains(randomReference);
    cy.get(ss.sendBtn).click();
    cy.get(ss.submittedTransactionMessage).should('have.text', msg.transferTxSuccess);
    cy.visit(urls.dashboard);
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find(ss.spinner).should('be.visible');
    cy.get('@tx').find(ss.transactionAddress).should('have.text', randomAddress);
    cy.get('@tx').find(ss.transactionAmount).should('have.text', randomAmount.toString());
    cy.wait(txConfirmationTimeout);
    cy.get('@tx').find(ss.spinner).should('be.not.visible');
  });

  /**
   * Make a transfer with second passphrase
   * @expect successfully go through transfer process
   * @expect transaction appears in the activity list as pending
   * @expect transaction appears in the activity list with correct data
   * @expect transaction appears in the activity list as confirmed
   */
  it('Transfer tx with second passphrase appears in wallet activity', () => {
    cy.autologin(accounts['second passphrase account'].passphrase, networks.devnet.node);
    cy.visit(urls.send);
    cy.get(ss.recipientInput).type(randomAddress);
    cy.get(ss.sendReferenceText).click().type(randomReference);
    cy.get(ss.amountInput).click().type(randomAmount);
    cy.get(ss.nextTransferBtn).click();
    enterSecondPassphraseOnSend(accounts['second passphrase account'].secondPassphrase);
    cy.get(ss.sendBtn).click();
    cy.get(ss.submittedTransactionMessage).should('have.text', msg.transferTxSuccess);
    cy.get(ss.okayBtn).click();
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find(ss.spinner).should('be.visible');
    cy.get('@tx').find(ss.transactionAddress).should('have.text', randomAddress);
  });

  /**
   * Shortcut URL prefills recipient, amount and reference
   * @expect recipient, amount and reference are prefilled
   */
  it('Launch protocol prefills fields  - from logged in state', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.send}/?recipient=4995063339468361088L&amount=5&reference=test`);
    cy.get(ss.recipientInput).should('have.value', '4995063339468361088L');
    cy.get(ss.amountInput).should('have.value', '5');
    cy.get(ss.sendReferenceText).should('have.value', 'test');
  });

  /**
   * Shortcut URL opens login page, then redirects to send page with prefilled fields
   * @expect recipient, amount and reference are prefilled
   */
  it('Launch protocol prefills fields  - from logged out state', () => {
    cy.visit(`${urls.send}/?recipient=4995063339468361088L&amount=5&reference=test`);
    loginUI(accounts.genesis.passphrase);
    cy.get(ss.recipientInput).should('have.value', '4995063339468361088L');
    cy.get(ss.amountInput).should('have.value', '5');
    cy.get(ss.sendReferenceText).should('have.value', 'test');
  });

  /**
   * Fiat converter shows amount in USD if set to USD
   * @expect amount in USD
   */
  it('Fiat converter shows amount in USD', () => {
    cy.addObjectToLocalStorage('settings', 'currency', 'USD');
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.send}?recipient=4995063339468361088L&amount=5`);
    cy.get(ss.convertedPrice).contains(/\d{1,100}(\.\d{1,2})? USD$/);
  });

  /**
   * Fiat converter shows amount in EUR if set to EUR
   * @expect amount in EUR
   */
  it('Fiat converter shows amount in EUR', () => {
    cy.addObjectToLocalStorage('settings', 'currency', 'EUR');
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.send}?recipient=4995063339468361088L&amount=5`);
    cy.get(ss.convertedPrice).contains(/\d{1,100}(\.\d{1,2})? EUR$/);
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
    cy.get(ss.sendFormAmountFeedback).contains('Provided amount is higher than your current balance.');
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
    cy.get(ss.submittedTransactionMessage).contains('Oops, looks like something went wrong. Please try again.');
  });

  it('Add to bookmarks button doesn’t exist if recipient is in followers', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node)
      .then(() => window.localStorage.setItem('followedAccounts', `[{"title":"Alice","address":"${accounts.genesis.address}","balance":101}]`));
    cy.visit(urls.send);
    cy.get(ss.recipientInput).type(accounts.genesis.address);
    cy.get(ss.amountInput).click().type(randomAmount);
    cy.get(ss.nextTransferBtn).click();
    cy.get(ss.sendBtn).click();
    cy.get(ss.addToBookmarks).should('not.exist');
  });
});

// this should be enable after bookmark be add to the send components at the end of transactions
describe.skip('Send: Bookmarks', () => {
  /**
   * Bookmarks suggestions are not present if there is no followers
   * @expect bookmarks components are not present
   */
  it('Bookmarks are not present if there is no followers', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node)
      .then(() => window.localStorage.removeItem('followedAccounts'));
    cy.visit(urls.send);
    cy.get(ss.recipientInput).click();
    cy.get(ss.bookmarkInput).should('not.exist');
    cy.get(ss.bookmarkList).should('not.exist');
  });

  /**
   * Choose follower from bookmarks and send tx
   * @expect bookmark contain name
   * @expect bookmark contain address
   * @expect clicking bookmark fills recipient
   * @expect tx appears in activity with right address
   */
  it('Choose follower from bookmarks and send tx', () => {
    window.localStorage.setItem('followedAccounts', `[
      {"title":"Alice","address":"${accounts.delegate.address}","balance":101}
    ]`);
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.send);
    cy.get(ss.recipientInput).click();
    cy.get(ss.bookmarkInput);
    cy.get(ss.bookmarkList).eq(0).contains('Alice');
    cy.get(ss.bookmarkList).eq(0).contains(accounts.delegate.address);
    cy.get(ss.bookmarkList).eq(0).click();
    cy.get(ss.recipientInput).should('have.value', accounts.delegate.address);
    cy.get(ss.amountInput).click().type(1);
    cy.get(ss.nextTransferBtn).click();
    cy.get(ss.sendBtn).click();
    cy.get(ss.okayBtn).click();
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find(ss.transactionAddress).eq(0).should('have.text', 'Alice');
    cy.get('@tx').find(ss.transactionAddress).eq(1).should('have.text', accounts.delegate.address);
  });

  /**
   * Search through bookmarks by typing
   * @expect account found by name
   * @expect non-existent search show empty list
   * @expect account found by delegate
   */
  it('Search through bookmarks by typing', () => {
    window.localStorage.setItem('followedAccounts', `[
      {"title":"Alice","address":"${accounts.delegate.address}","balance":101},
      {"title":"Bob","address":"${accounts.genesis.address}","balance":101}
    ]`);
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.send);
    cy.get(ss.recipientInput).click().type('Bob');
    cy.get(ss.bookmarkList).eq(0).contains('Bob');
    cy.get(ss.recipientInput).clear();
    cy.get(ss.recipientInput).click().type('Merkel');
    cy.get(ss.bookmarkList).should('not.exist');
    cy.get(ss.recipientInput).clear();
    cy.get(ss.recipientInput).click().type(accounts.delegate.address);
    cy.get(ss.bookmarkList).eq(0).contains(accounts.delegate.address);
    cy.get(ss.bookmarkList).eq(0).click();
    cy.get(ss.recipientInput).should('have.value', accounts.delegate.address);
  });
});
