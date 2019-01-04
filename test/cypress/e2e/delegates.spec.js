import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import ss from '../../constants/selectors';
import urls from '../../constants/urls';
import enterSecondPassphrase from '../utils/enterSecondPassphrase';
import compareBalances from '../utils/compareBalances';

const txConfirmationTimeout = 20000;
const txVotePrice = 1;

describe('Delegates', () => {
  /**
   * Delegate voting page can be opened by direct link
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  it(`opens by url ${urls.delegates}`, () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.delegates);
    cy.url().should('contain', urls.delegates);
    cy.get(ss.votesConfirmSidebar).find(ss.nextBtn);
  });

  /**
   * Delegate voting page can be opened clicking sidebar button
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  it('opens by sidebar button', () => {
    cy.addLocalStorage('settings', 'advancedMode', true);
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.dashboard);
    cy.get(ss.sidebarMenuDelegatesBtn).should('have.css', 'opacity', '1').click();
    cy.url().should('contain', urls.delegates);
    cy.get(ss.votesConfirmSidebar).find(ss.nextBtn);
  });

  /**
   * Become a delegate link absent if I am a delegate
   * @expect link does not exist
   */
  it('Become a delegate link absent if I am a delegate', () => {
    cy.autologin(accounts.delegate.passphrase, networks.devnet.node);
    cy.visit(urls.delegates);
    cy.get(ss.becomeDelegateLink).should('not.exist');
  });

  /**
   * Become a delegate link leads to Delegate register page
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  it('Become a delegate link -> Delegate register page', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.delegates);
    cy.get(ss.becomeDelegateLink).click();
    cy.url().should('contain', urls.registerDelegate);
    cy.get(ss.chooseDelegateName);
  });

  /**
   * Scrolling down triggers loading another portion of delegates
   * @expect more delegates are present
   */
  it('Displays 100 delegates and loads more as I scroll to bottom', () => {
    cy.autologin(accounts.genesis.passphrase, networks.testnet.node);
    cy.visit(urls.delegates);
    cy.get(ss.delegateRow).should('have.length', 100);
    cy.get(ss.delegateList).scrollTo('bottom');
    cy.get(ss.delegateRow).should('have.length', 200);
  });

  /**
   * Delegates table shows all the necessary data
   * @expect data from Vote, Rank, Name, Lisk ID, Productivity columns match expected values
   */
  it('Vote, Rank, Name, Lisk ID, Productivity columns show corresponding data', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.delegates);
    cy.get(ss.delegateRow).eq(0).as('dg');
    cy.get('@dg').find(ss.delegateRank).should('have.text', '1');
    cy.get('@dg').find(ss.delegateName).contains(/genesis_\d+/);
    cy.get('@dg').find(ss.delegateId).contains(/\d+L/);
    cy.get('@dg').find(ss.delegateProductivity).contains(/\d+ %/);
  });

  /**
   * Search for a delegate functioning correctly
   * @expect enter some gibberish: no delegates are shown
   * @expect enter a delegate's name: delegate is shown in first row
   */
  it('Search for a delegate', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.delegates);
    cy.get(ss.searchDelegateInput).click().type('doesntexist');
    cy.get(ss.delegateRow).should('not.exist');
    cy.get(ss.searchDelegateInput).click().clear().type(accounts.delegate.username);
    cy.get(ss.delegateRow).eq(0).as('dg');
    cy.get('@dg').find(ss.delegateName).should('have.text', accounts.delegate.username);
    cy.get('@dg').find(ss.delegateId).should('have.text', accounts.delegate.address);
    cy.get('@dg').find(ss.delegateProductivity).contains(/\d+ %/);
  });

  /**
   * Voting and unvoting process
   * @expect successfully go through the voting process
   * @expect spinner to appear instead of checkbox while tx is pending
   * @expect checkbox to be unchecked after unvoting
   * @expect checkbox to be checked after voting back
   * @expect balance decreases as tx is confirmed
   */
  /* eslint-disable max-statements */
  it('Unvote and Vote + Header balance is affected', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.delegates);
    cy.get(ss.headerBalance).invoke('text').as('balanceBefore');
    cy.get(ss.nextBtn).should('be.disabled');
    cy.get(ss.selectionVotingNumber).should('have.text', '0');
    cy.get(ss.delegateRow).eq(0).as('dg');
    cy.get('@dg').find(ss.voteCheckbox).should('have.class', 'checked');
    // Unvote
    cy.get('@dg').find(ss.voteCheckbox).click();
    cy.get(ss.selectionVotingNumber).should('have.text', '1');
    cy.get(ss.nextBtn).click();
    cy.get(ss.delegateRow).should('have.length', 1);
    cy.get(ss.confirmBtn).click();
    cy.get(ss.voteResultHeader).contains('Votes submitted');
    cy.get(ss.okayBtn).click();
    cy.get(ss.selectionVotingNumber).should('have.text', '0');
    cy.get(ss.delegateRow).eq(0).as('dg');
    cy.get('@dg').find(ss.spinner);
    cy.get('@dg').find(ss.voteCheckbox, { timeout: txConfirmationTimeout }).should('have.class', 'unchecked');
    cy.get(ss.headerBalance).invoke('text').as('balanceAfter').then(function () {
      compareBalances(this.balanceBefore, this.balanceAfter, txVotePrice);
    });
    // Vote
    cy.get(ss.nextBtn).should('be.disabled');
    cy.get(ss.delegateRow).eq(0).as('dg');
    cy.get('@dg').find(ss.voteCheckbox).click();
    cy.get(ss.selectionVotingNumber).should('have.text', '1');
    cy.get(ss.nextBtn).click();
    cy.get(ss.delegateRow).should('have.length', 1);
    cy.get(ss.confirmBtn).click();
    cy.get(ss.voteResultHeader).contains('Votes submitted');
    cy.get(ss.okayBtn).click();
    cy.get(ss.selectionVotingNumber).should('have.text', '0');
    cy.get(ss.delegateRow).eq(0).as('dg');
    cy.get('@dg').find(ss.spinner);
    cy.get('@dg').find(ss.voteCheckbox, { timeout: txConfirmationTimeout }).should('have.class', 'checked');
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
    cy.visit(`${urls.delegatesVote}?votes=genesis_12,genesis_14,genesis_16`);
    cy.get(ss.votesPreselection).contains('genesis_12, genesis_14, genesis_16');
    cy.get(ss.nextBtn).click();
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

  /**
   * Delegate list filtering
   * @expect on Voted tab only voted delegates are shown
   * @expect on Not voted tab only not voted delegates are shown
   * @expect on All tab all delegates are shown
   */
  it('Filter voted/not voted delegates', () => {
    cy.autologin(accounts.delegate.passphrase, networks.devnet.node);
    cy.visit(urls.delegates);
    // Filter Voted
    cy.get(ss.filterVoted).click();
    cy.get(ss.delegateRow).eq(0).find(ss.delegateName).contains('genesis_17');
    cy.get(ss.delegateRow).should('have.length', 1);
    // Filter Not voted
    cy.get(ss.filterNotVoted).click();
    cy.get(ss.searchDelegateInput).click().type('genesis_17');
    cy.get(ss.delegateRow).should('not.exist');
    cy.get(ss.searchDelegateInput).click().clear();
    // Filter All
    cy.get(ss.filterAll).click();
    cy.get(ss.delegateRow).should('have.length', 100);
    cy.get(ss.searchDelegateInput).click().type('genesis_17');
    cy.get(ss.delegateRow).should('have.length', 1);
  });
});
