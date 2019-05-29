/**
 * Voting and unvoting process
 * @expect successfully go through the voting process
 * @expect spinner to appear instead of checkbox while tx is pending
 * @expect checkbox to be unchecked after unvoting
 * @expect checkbox to be checked after voting back
 * @expect balance decreases as tx is confirmed
 */
/* eslint-disable max-statements */
import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';
import compareBalances from '../utils/compareBalances';
import enterSecondPassphrase from '../utils/enterSecondPassphrase';

const txConfirmationTimeout = 20000;
const txVotePrice = 1;

describe('Delegates Voting', () => {
  it('Unvote and Vote + Header balance is affected', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.delegates);
    cy.get(ss.headerBalance).invoke('text').as('balanceBefore');
    cy.get(ss.nextBtn).should('be.disabled');
    cy.get(ss.selectionVotingNumber).should('have.text', '0');
    cy.get(ss.totalVotingNumber).should('have.text', '101');
    cy.get(ss.delegateRow).eq(0).as('dg');
    cy.get('@dg').find(ss.voteCheckbox).should('have.class', 'checked');
    // Unvote
    cy.get('@dg').find(ss.voteCheckbox).click();
    cy.get(ss.selectionVotingNumber).should('have.text', '1');
    cy.get(ss.totalVotingNumber).should('have.text', '100');
    cy.get('@dg').find(ss.voteCheckbox).click();
    cy.get(ss.selectionVotingNumber).should('have.text', '0');
    cy.get(ss.totalVotingNumber).should('have.text', '101');
    cy.get('@dg').find(ss.voteCheckbox).click();
    cy.get(ss.nextBtn).click();
    cy.get(ss.delegateRow).should('have.length', 1);
    cy.get(ss.confirmBtn).click();
    cy.get(ss.voteResultHeader).contains('Votes submitted');
    cy.get(ss.okayBtn).click();
    cy.get(ss.selectionVotingNumber).should('have.text', '0');
    cy.get(ss.delegateRow).eq(0).as('dg');
    cy.get('@dg').find(ss.spinner);
    cy.get('@dg').find(ss.voteCheckbox, { timeout: txConfirmationTimeout }).should('have.class', 'unchecked');
    cy.get(ss.selectionVotingNumber).should('have.text', '0');
    cy.get(ss.totalVotingNumber).should('have.text', '100');
    cy.get(ss.headerBalance).invoke('text').as('balanceAfter').then(function () {
      compareBalances(this.balanceBefore, this.balanceAfter, txVotePrice);
    });
    // Vote
    cy.get(ss.nextBtn).should('be.disabled');
    cy.get(ss.delegateRow).eq(0).as('dg');
    cy.get('@dg').find(ss.voteCheckbox).click();
    cy.get(ss.selectionVotingNumber).should('have.text', '1');
    cy.get(ss.totalVotingNumber).should('have.text', '101');
    cy.get('@dg').find(ss.voteCheckbox).click();
    cy.get(ss.selectionVotingNumber).should('have.text', '0');
    cy.get(ss.totalVotingNumber).should('have.text', '100');
    cy.get('@dg').find(ss.voteCheckbox).click();
    cy.get(ss.nextBtn).click();
    cy.get(ss.delegateRow).should('have.length', 1);
    cy.get(ss.confirmBtn).click();
    cy.get(ss.voteResultHeader).contains('Votes submitted');
    cy.get(ss.okayBtn).click();
    cy.get(ss.selectionVotingNumber).should('have.text', '0');
    cy.get(ss.totalVotingNumber).should('have.text', '101');
    cy.get(ss.delegateRow).eq(0).as('dg');
    cy.get('@dg').find(ss.spinner);
    cy.get('@dg').find(ss.voteCheckbox, { timeout: txConfirmationTimeout }).should('have.class', 'checked');
    cy.get(ss.topBarMenuWalletBtn).click();
    cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).should('have.text', 'Delegate vote');
    cy.get(`${ss.transactionRow} ${ss.transactionAmountPlaceholder}`).eq(0).should('have.text', '-');
  });

  /**
 * Voting with second passphrase
 * @expect successfully go through the voting process
 * @expect transaction is confirmed
 */
  it('Vote with second passphrase', () => {
    cy.autologin(accounts['second passphrase account'].passphrase, networks.devnet.node);
    cy.visit(urls.delegates);
    cy.get(ss.delegateRow).eq(0).as('dg');
    cy.get('@dg').find(ss.voteCheckbox).click();
    cy.get(ss.nextBtn).click();
    enterSecondPassphrase(accounts['second passphrase account'].secondPassphrase);
    cy.get(ss.confirmBtn).click();
    cy.get(ss.voteResultHeader).contains('Votes submitted');
    cy.get(ss.okayBtn).click();
    cy.get(ss.delegateRow).eq(0).as('dg');
    cy.get('@dg').find(ss.spinner);
    cy.get('@dg').find(ss.voteCheckbox, { timeout: txConfirmationTimeout });
  });

  /**
 * Bulk vote/unvote delegates using URL shortcut
 * @expect chosen to vote delegates shown in pre-selection
 * @expect chosen to unvote delegates are shown in pre-selection
 * @expect already voted/unvoted delegates shown in pre-selection
 */
  it('Bulk vote/unvote delegates by URL', () => {
    cy.autologin(accounts['delegate candidate'].passphrase, networks.devnet.node);
    cy.visit(urls.dashboard);
    cy.visit(`${urls.delegatesVote}?votes=genesis_12,genesis_14,genesis_16`);
    cy.get(ss.votesPreselection).contains('genesis_12, genesis_14, genesis_16');
    cy.get(ss.nextBtn).should('be.enabled').click();
    cy.get(ss.confirmBtn).click();
    cy.get(ss.voteResultHeader).contains('Votes submitted');
    cy.wait(txConfirmationTimeout);
    cy.visit(urls.wallet);
    cy.visit(`${urls.delegatesVote}?unvotes=genesis_12`);
    cy.get(ss.unvotesPreselection).contains('genesis_12');
    cy.visit(urls.wallet);
    cy.visit(`${urls.delegatesVote}?votes=genesis_14,genesis_16`);
    cy.get(ss.alreadyVotedPreselection).contains('genesis_14, genesis_16');
  });
});
