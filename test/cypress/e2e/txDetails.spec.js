import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';
import regex from '../../../src/utils/regex';

const txConfirmationTimeout = 14000;

const delegateVoteTxId = '7150719741601338678';
const delegateRegTxId = '2697129531259680873';
const secondPassphraseRegTxId = '18129432350589863394';

describe('Tx details', () => {
  /**
   * Transfer transaction details are shown and correct when tx is pending and confirmed
   * @expect transfer details are correct for pending state
   * @expect transfer details are correct for confirmed state
   */
  it('Transfer details while pending and then confirmed', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.send}?recipient=${accounts.delegate.address}&amount=5&reference=test-details`);
    cy.get(ss.nextTransferBtn).click();
    cy.get(ss.sendBtn).click();
    cy.get(ss.okayBtn).click();
    cy.get(ss.transactionRow).find(ss.spinner).click();
    // Before confirmation
    cy.get(ss.txHeader).contains('Transaction');
    cy.get(ss.txSenderAddress).should('have.text', accounts.genesis.address)
      .click();
    cy.get(ss.leftBlockAccountExplorer).find(ss.accountAddress).should('have.text', accounts.genesis.address);
    cy.go('back');
    cy.get(ss.txRecipientAddress).should('have.text', accounts.delegate.address)
      .click();
    cy.get(ss.leftBlockAccountExplorer).find(ss.accountAddress).should('have.text', accounts.delegate.address);
    cy.go('back');
    cy.get(ss.txAddedVotes).should('not.exist');
    cy.get(ss.txRemovedVotes).should('not.exist');
    cy.get(ss.txAmount).should('have.text', '-5');
    cy.get(ss.txFee).should('have.text', '0.1');
    cy.get(ss.txId).contains(regex.transactionId);
    cy.get(ss.txReference).should('have.text', 'test-details');
    // After confirmation
    cy.get(ss.txDate, { timeout: txConfirmationTimeout }).contains(new Date().getFullYear());
    cy.get(ss.txConfirmations).should('have.text', '1');
  });

  /**
   * Delegate transaction details are shown and correct when tx is confirmed
   * @expect transfer details are correct for confirmed state
   */
  it('Vote', () => {
    cy.autologin(accounts.delegate.passphrase, networks.devnet.node);
    cy.visit(`${urls.wallet}?id=${delegateVoteTxId}`);
    // Header
    cy.get(ss.txHeader).contains('Delegate vote');
    // Sender
    cy.get(ss.txSenderAddress).should('have.text', accounts.delegate.address)
      .click();
    cy.get(ss.leftBlockAccountExplorer).find(ss.accountAddress).should('have.text', accounts.delegate.address);
    cy.go('back');
    // Recipient
    cy.get(ss.txRecipientAddress).should('not.exist');
    // Date
    cy.get(ss.txDate).contains(new Date().getFullYear());
    // Added votes
    cy.get(ss.txAddedVotes).contains(accounts.delegate.username)
      .click();
    cy.get(ss.leftBlockAccountExplorer).find(ss.accountAddress).should('have.text', accounts.delegate.address);
    cy.go('back');
    // Removed votes TODO add unvotes when Commander 2.0 will be free of bugs
    cy.get(ss.txRemovedVotes).should('not.exist');
    // Fee
    cy.get(ss.txFee).should('have.text', '1');
    // Confirmations
    cy.get(ss.txConfirmations).contains(/^\d/);
    // Transaction ID
    cy.get(ss.txId).contains(regex.transactionId);
    // Reference
    cy.get(ss.txReference).should('have.text', '-');
  });

  // TODO update after bugfix #1424
  // - direct url doesn't work
  // - some values are undefined for tx from snapshot
  /**
   * Delegate registration transaction details are shown and correct when tx is confirmed
   * @expect transfer details are correct for confirmed state
   */
  it.skip('Delegate registration', () => {
    cy.autologin(accounts.delegate.passphrase, networks.devnet.node);
    cy.visit(`${urls.wallet}?id=${delegateRegTxId}`);
    cy.get(ss.txHeader).contains('Delegate registration');
    cy.get(ss.txSenderAddress).should('have.text', accounts.delegate.address);
    cy.get(ss.txRecipientAddress).should('not.exist');
    // cy.get(ss.txDate).contains(new Date().getFullYear());
    cy.get(ss.txAddedVotes).should('not.exist');
    cy.get(ss.txRemovedVotes).should('not.exist');
    // cy.get(ss.txFee).should('have.text', '25');
    cy.get(ss.txConfirmations).contains(/^\d/);
    cy.get(ss.txId).contains(regex.transactionId);
    cy.get(ss.txReference).should('have.text', '-');
  });

  /**
   * Register second passphrase transaction details are shown and correct when tx is confirmed
   * @expect transfer details are correct for confirmed state
   */
  it('Second passphrase registration', () => {
    cy.autologin(accounts['second passphrase account'].passphrase, networks.devnet.node);
    cy.visit(`${urls.wallet}?id=${secondPassphraseRegTxId}`);
    // Header
    cy.get(ss.txHeader).contains('Second passphrase registration');
    // Sender
    cy.get(ss.txSenderAddress).should('have.text', accounts['second passphrase account'].address)
      .click();
    cy.get(ss.leftBlockAccountExplorer).find(ss.accountAddress).should('have.text', accounts['second passphrase account'].address);
    cy.go('back');
    // Recipient
    cy.get(ss.txRecipientAddress).should('not.exist');
    // Date
    cy.get(ss.txDate).contains(new Date().getFullYear());
    // Added votes
    cy.get(ss.txAddedVotes).should('not.exist');
    // Removed votes
    cy.get(ss.txRemovedVotes).should('not.exist');
    // Fee
    cy.get(ss.txFee).should('have.text', '5');
    // Confirmations
    cy.get(ss.txConfirmations).contains(/^\d/);
    // Transaction ID
    cy.get(ss.txId).contains(regex.transactionId);
    // Reference
    cy.get(ss.txReference).should('have.text', '-');
  });
});
