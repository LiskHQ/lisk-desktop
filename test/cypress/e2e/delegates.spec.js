import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import enterSecondPassphrase from '../utils/enterSecondPassphrase';

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
};

const txConfirmationTimeout = 20000;

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
    cy.get(ss.sidebarMenuDelegatesBtn).click();
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
    cy.autologin(accounts.genesis.passphrase, networks.mainnet.node);
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

  // TODO Add balance substraction check after #1391 is fixed
  it('Unvote and Vote', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.delegates);
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

  // TODO Unskip after #1359 fix
  it.skip('should allow to select delegates by URL', () => {
    cy.loginUI(accounts['delegate candidate'], 'dev');
    cy.visit('/delegates/vote?votes=genesis_12,genesis_14,genesis_16');
    cy.get('.upvotes-message').should('have.text', 'genesis_12, genesis_14, genesis_16');
    cy.get('.next').click();
    cy.get('.confirm').click();
    cy.get('.result-box-message').should('have.text', 'Your votes are being processed. It may take up to 10 minutes for it to be secured in the blockchain.');
    cy.wait(10000);
    cy.visit('/wallet');
    cy.wait(20000);
    cy.visit('/delegates/vote?unvotes=genesis_12');
    cy.get('.unvotes-message').should('have.text', 'genesis_12');
    cy.visit('/wallet');
    cy.visit('/delegates/vote?votes=genesis_14,genesis_16');
    cy.get('.alreadyVoted-messages');
  });
});
