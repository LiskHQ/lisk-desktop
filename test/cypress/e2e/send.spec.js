import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';
import enterSecondPassphrase from '../utils/enterSecondPassphrase';
import compareBalances from '../utils/compareBalances';

const getFollowedAccountObjFromLS = () => JSON.parse(localStorage.getItem('followedAccounts'));

const msg = {
  transferTxSuccess: 'Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain.',
  accountInitializatoinAddress: 'Account initialization',
};

const txSendCost = 0.1;
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
    cy.wait(500);
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
    cy.get(ss.recipientConfirmLabel).last().contains(randomAddress);
    cy.get(ss.referenceConfirmLabel).contains(randomReference);
    cy.get(ss.amountInput).invoke('val').should('equal', (randomAmount + txSendCost).toString());
    cy.get(ss.sendBtn).click();
    cy.get(ss.resultMessage).should('have.text', msg.transferTxSuccess);
    cy.visit(urls.dashboard);
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find(ss.spinner);
    cy.get('@tx').find(ss.transactionAddress).should('have.text', randomAddress);
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
  it('Transfer tx with second passphrase appears in wallet activity', () => {
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
    cy.addObjectToLocalStorage('settings', 'currency', 'USD');
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.send}?recipient=4995063339468361088L&amount=5`);
    cy.get(ss.convertedPrice).contains(/^\d{1,100}(\.\d{1,2})? USD$/);
  });

  /**
   * Fiat converter shows amount in EUR if set to EUR
   * @expect amount in EUR
   */
  it('Fiat converter shows amount in EUR', () => {
    cy.addObjectToLocalStorage('settings', 'currency', 'EUR');
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.send}?recipient=4995063339468361088L&amount=5`);
    cy.get(ss.convertedPrice).contains(/^\d{1,100}(\.\d{1,2})? EUR$/);
  });

  /**
   * Initialization banner should appear on dashboard with account not initialized.
   * @expect initialization dialogue is shown
   * @expect successfully go through initialization
   * @expect transfer transaction appear with correct data
   * @expect initialization dialogue is not shown anymore
   */
  it('Should show initialize banner with account not initialized', () => {
    cy.autologin(accounts['without initialization'].passphrase, networks.devnet.node);
    cy.reload();
    cy.visit(urls.wallet);
    cy.get(ss.transactionSendButton).click();
    cy.get(ss.accountInitializationMsg).should('not.exist');
    cy.get(ss.recipientInput).should('exist');
    cy.visit(urls.dashboard);
    cy.get(ss.initializeBanner).should('exist');
    cy.get(ss.initializeBanner).find('a').click();
    cy.get(ss.backButton).click();
    cy.get(ss.accountInitializationMsg).get(ss.accountInitializationBtn).click();
    cy.get(ss.sendBtn).click();
    cy.get(ss.resultMessage).should('have.text', msg.transferTxSuccess);
    cy.get(ss.accountInitializationMsg).should('not.exist');
    cy.wait(txConfirmationTimeout);
    cy.reload();
    cy.visit(urls.wallet);
    cy.get(ss.transactionRow).eq(0).as('tx');
    cy.get('@tx').find(ss.transactionAddress).should('have.text', accounts['without initialization'].address);
    cy.visit(urls.dashboard);
    cy.get(ss.initializeBanner).should('not.exist');
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


  it('Add to bookmarks after transfer tx (when recipient is not in followers)', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.send);
    cy.get(ss.recipientInput).type(accounts.delegate.address);
    cy.get(ss.amountInput).click().type(randomAmount);
    cy.get(ss.nextTransferBtn).click();
    cy.get(ss.sendBtn).click();
    cy.get(ss.addToBookmarks).click();
    cy.get(ss.titleInput).type('Bob');
    cy.get(ss.confirmAddToBookmarks).click()
      .should(() => {
        expect(getFollowedAccountObjFromLS()[0].address).to.equal(accounts.delegate.address);
        expect(getFollowedAccountObjFromLS()[0].title).to.equal('Bob');
      });
    cy.get(ss.resultMessage).contains('has been added to your Dashboard');
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

describe('Send: Bookmarks', () => {
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
    cy.get(ss.transactionRow).eq(0).find(ss.transactionAddress).should('have.text', accounts.delegate.address);
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
