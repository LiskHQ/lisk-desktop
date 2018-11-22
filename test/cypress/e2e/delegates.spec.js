import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import enterSecondPassphrase from '../utils/enterSecondPassphrase';
import compareBalances from '../utils/compareBalances';

const ss = {
  sidebarMenuDelegatesBtn: '#delegates',
  nextButton: '.next',
  chooseName: '.choose-name',
  becomeDelegateLink: '.register-delegate',
  confirmVotesSidebar: '.confirm-votes',
  nextBtn: '.next',
  confirmBtn: '.confirm',
  okayBtn: '.okay-button',
  spinner: '.spinner',
  delegateRow: '.delegate-row',
  delegateList: '.delegate-list',
  delegateRank: '.delegate-rank',
  delegateName: '.delegate-name',
  delegateId: '.delegate-id',
  delegateProductivity: '.delegate-productivity',
  searchDelegateInput: 'input.search',
  voteCheckbox: '.vote-checkbox',
  voteResultHeader: '.result-box-header',
  clearSearchBtn: '.clean-icon',
  headerBalance: '.balance span',
  votesPreselection: '.upvotes-message',
  unvotesPreselection: '.unvotes-message',
  alreadyVotedPreselection: '.alreadyVoted-message',
};

const txConfirmationTimeout = 20000;
const txVotePrice = 1;

describe('Delegates', () => {
  it(`opens by url ${urls.delegates}`, () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.delegates);
    cy.url().should('contain', urls.delegates);
    cy.get(ss.confirmVotesSidebar).find(ss.nextButton);
  });

  it('opens by sidebar button', () => {
    cy.addLocalStorage('settings', 'advancedMode', true);
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.dashboard);
    cy.get(ss.sidebarMenuDelegatesBtn).should('have.css', 'opacity', '1').click();
    cy.url().should('contain', urls.delegates);
    cy.get(ss.confirmVotesSidebar).find(ss.nextButton);
  });

  it('Become a delegate link -> Delegate register page', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.delegates);
    cy.get(ss.becomeDelegateLink).click();
    cy.url().should('contain', urls.registerDelegate);
    cy.get(ss.chooseName);
  });

  it('Become a delegate link absent if I am a delegate', () => {
    cy.autologin(accounts.delegate.passphrase, networks.devnet.node);
    cy.visit(urls.delegates);
    cy.get(ss.becomeDelegateLink).should('not.exist');
  });

  it('Displays 100 delegates and loads more as I scroll to bottom', () => {
    cy.autologin(accounts.genesis.passphrase, networks.testnet.node);
    cy.visit(urls.delegates);
    cy.get(ss.delegateRow).should('have.length', 100);
    cy.get(ss.delegateList).scrollTo('bottom');
    cy.get(ss.delegateRow).should('have.length', 200);
  });

  it('Vote, Rank, Name, Lisk ID, Productivity columns show corresponding data', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.delegates);
    cy.get(ss.delegateRow).eq(0).as('dg');
    cy.get('@dg').find(ss.delegateRank).should('have.text', '1');
    cy.get('@dg').find(ss.delegateName).contains(/genesis_\d+/);
    cy.get('@dg').find(ss.delegateId).contains(/\d+L/);
    cy.get('@dg').find(ss.delegateProductivity).contains(/\d+ %/);
  });

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

  it('Unvote and Vote + Header balance is affected', function () {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.delegates);
    cy.get(ss.headerBalance).invoke('text').as('balanceBefore');
    cy.get(ss.delegateRow).eq(0).as('dg');
    cy.get('@dg').find(ss.voteCheckbox).should('have.class', 'checked');
    // Unvote
    cy.get('@dg').find(ss.voteCheckbox).click();
    cy.get(ss.nextBtn).click();
    cy.get(ss.confirmBtn).click();
    cy.get(ss.voteResultHeader).contains('Votes submitted');
    cy.get(ss.okayBtn).click();
    cy.get(ss.delegateRow).eq(0).as('dg');
    cy.get('@dg').find(ss.spinner);
    cy.get('@dg').find(ss.voteCheckbox, { timeout: txConfirmationTimeout }).should('have.class', 'unchecked');
    cy.get(ss.headerBalance).invoke('text').as('balanceAfter').then(() => {
      compareBalances(this.balanceBefore, this.balanceAfter, txVotePrice);
    });
    // Vote
    cy.get(ss.delegateRow).eq(0).as('dg');
    cy.get('@dg').find(ss.voteCheckbox).click();
    cy.get(ss.nextBtn).click();
    cy.get(ss.confirmBtn).click();
    cy.get(ss.voteResultHeader).contains('Votes submitted');
    cy.get(ss.delegateRow).eq(0).as('dg');
    cy.get('@dg').find(ss.spinner);
    cy.get('@dg').find(ss.voteCheckbox, { timeout: txConfirmationTimeout }).should('have.class', 'checked');
  });

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
});
