import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';
import regex from '../../../src/utils/regex';

const transferTxId = '12400920197376315040';
const delegateVoteTxId = '9400328732388578360';
const delegateRegTxId = '2697129531259680873';
const secondPassphraseRegTxId = '16730031459010386209';

describe('Tx details', () => {
  /**
   * Transfer transaction details are shown and correct
   * @expect transfer details are correct
   */
  it('Transfer Transaction details ', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.transactions}/${transferTxId}`);
    cy.get(ss.txSenderAddress).should('have.text', accounts.genesis.address)
      .click();
    cy.get(ss.accountAddress).should('have.text', accounts.genesis.address);
    cy.go('back');
    cy.get(ss.txRecipientAddress).should('have.text', accounts['delegate candidate'].address)
      .click();
    cy.get(ss.accountAddress).should('have.text', accounts['delegate candidate'].address);
    cy.go('back');
    cy.get(ss.txAddedVotes).should('not.exist');
    cy.get(ss.txRemovedVotes).should('not.exist');
    cy.get(ss.txAmount).should('have.text', '90 LSK');
    cy.get(ss.txFee).should('have.text', '0.1');
    cy.get(ss.txId).contains(regex.transactionId);
    cy.get(ss.txReference).should('have.text', 'delegate-candidate');
    cy.get(ss.txDate).contains(/20\d\d/);
    cy.get(ss.txConfirmations).contains(/^\d/);
  });

  /**
   * Delegate transaction details are shown and correct
   * @expect transfer details are correct
   */
  it('Vote details', () => {
    const votedDelegateName = 'genesis_51';
    cy.autologin(accounts.delegate.passphrase, networks.devnet.node);
    cy.visit(`${urls.transactions}/${delegateVoteTxId}`);
    cy.get(ss.txHeader).contains('Vote Transaction');
    cy.get(ss.txSenderAddress).should('have.text', accounts.delegate.address)
      .click();
    cy.get(ss.accountAddress).should('have.text', accounts.delegate.address);
    cy.go('back');
    cy.get(ss.txRecipientAddress).should('not.exist');
    cy.get(ss.txAddedVotes).contains(votedDelegateName)
      .click();
    cy.get(ss.accountName).should('have.text', votedDelegateName);
    cy.go('back');
    cy.get(ss.txRemovedVotes).contains(accounts.delegate.username)
      .click();
    cy.get(ss.accountName).should('have.text', accounts.delegate.username);
    cy.go('back');
    cy.get(ss.txFee).should('have.text', '1');
    cy.get(ss.txId).contains(regex.transactionId);
    cy.get(ss.txReference).should('not.exist');
    cy.get(ss.txDate).contains(/20\d\d/);
    cy.get(ss.txConfirmations).contains(/^\d/);
  });

  /**
   * Delegate registration transaction details are shown and correct
   * @expect transfer details are correct
   */
  it('Delegate reg details', () => {
    cy.autologin(accounts.delegate.passphrase, networks.devnet.node);
    cy.visit(`${urls.transactions}/${delegateRegTxId}`);
    cy.get(ss.txHeader).contains('Delegate Registration');
    cy.get(ss.txSenderAddress).should('have.text', accounts.delegate.address)
      .click();
    cy.get(ss.accountAddress).should('have.text', accounts.delegate.address);
    cy.go('back');
    cy.get(ss.txRecipientAddress).should('not.exist');
    cy.get(ss.txDate).contains(/20\d\d/);
    cy.get(ss.txAddedVotes).should('not.exist');
    cy.get(ss.txRemovedVotes).should('not.exist');
    cy.get(ss.txConfirmations).contains(/^\d/);
    cy.get(ss.txId).contains(regex.transactionId);
    cy.get(ss.txReference).should('not.exist');
    cy.get(ss.txConfirmations).contains(/^\d/);
  });

  /**
   * Register second passphrase transaction details are shown and correct
   * @expect transfer details are correct
   */
  it('2nd passphrase reg details', () => {
    cy.autologin(accounts['second passphrase account'].passphrase, networks.devnet.node);
    cy.visit(`${urls.transactions}/${secondPassphraseRegTxId}`);
    cy.get(ss.txHeader).contains('2nd Passphrase Registration');
    cy.get(ss.txSenderAddress).should('have.text', accounts['second passphrase account'].address)
      .click();
    cy.get(ss.accountAddress).should('have.text', accounts['second passphrase account'].address);
    cy.go('back');
    cy.get(ss.txRecipientAddress).should('not.exist');
    cy.get(ss.txDate).contains(/20\d\d/);
    cy.get(ss.txAddedVotes).should('not.exist');
    cy.get(ss.txRemovedVotes).should('not.exist');
    cy.get(ss.txFee).should('have.text', '5');
    cy.get(ss.txConfirmations).contains(/^\d/);
    cy.get(ss.txId).contains(regex.transactionId);
    cy.get(ss.txReference).should('not.exist');
    cy.get(ss.txConfirmations).contains(/^\d/);
  });
});
