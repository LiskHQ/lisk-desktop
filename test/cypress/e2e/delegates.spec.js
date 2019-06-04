import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import ss from '../../constants/selectors';
import urls from '../../constants/urls';

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
    cy.get(ss.votingHeader).find(ss.startVotingButton);
  });

  /**
   * Delegate voting page can be opened clicking sidebar button
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  it('opens by top bar button', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.dashboard);
    cy.get(ss.sidebarMenuDelegatesBtn).should('have.css', 'opacity', '1').click();
    cy.url().should('contain', urls.delegates);
    cy.get(ss.votingHeader).find(ss.startVotingButton);
  });

  /**
   * Become a delegate link absent if I am a delegate
   * @expect link does not exist
   */
  // TODO Unskip after https://github.com/LiskHQ/lisk-hub/issues/2103 fix
  xit('Become a delegate link absent if I am a delegate', () => {
    cy.autologin(accounts.delegate.passphrase, networks.devnet.node);
    cy.visit(urls.delegates);
    cy.get(ss.startVotingButton).should('exist');
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
  it('Displays 101 delegates and loads more as I scroll to bottom', () => {
    cy.autologin(accounts.genesis.passphrase, networks.testnet.node);
    cy.visit(urls.delegates);
    cy.get(ss.delegateName);
    cy.get(ss.delegateRow).should('have.length', 101);
    cy.get(ss.loadMoreButton).click();
    cy.get(ss.delegateRow).should('have.length', 202);
  });

  it('Displays 101 delegates in guest mode', () => {
    cy.visit(urls.delegates);
    cy.get(ss.delegateName);
    cy.get(ss.delegateRow).should('have.length', 101);
  });

  /**
   * Delegates table shows all the necessary data
   * @expect data from Vote, Rank, Name, Lisk ID, Productivity columns match expected values
   */
  it('Vote, Rank, Name, Lisk ID, Productivity columns show corresponding data', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.delegates);
    cy.get(ss.delegateRow).eq(0).as('dg');
    cy.get('@dg').find(ss.delegateRank).should('have.text', '#1');
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
   * Delegate list filtering
   * @expect on Voted tab only voted delegates are shown
   * @expect on Not voted tab only not voted delegates are shown
   * @expect on All tab all delegates are shown
   */
  it('Filter voted/not voted delegates', () => {
    cy.server();
    cy.route('/api/delegates**').as('requestDelegate');
    cy.autologin(accounts.delegate.passphrase, networks.devnet.node);
    cy.visit(urls.delegates);
    cy.wait('@requestDelegate');
    // Filter Voted
    cy.get(ss.filterVoted).click();
    cy.get(ss.delegateRow).eq(0).find(ss.delegateName).contains('genesis_51');
    cy.get(ss.delegateRow).should('have.length', 1);
    // Filter Not voted
    cy.get(ss.filterNotVoted).click();
    cy.get(ss.searchDelegateInput).click().type('genesis_51');
    cy.get(ss.delegateRow).should('not.exist');
    cy.get(ss.searchDelegateInput).click().clear();
    // Filter All
    cy.get(ss.filterAll).click();
    cy.get(ss.delegateRow).should('have.length', 101);
    cy.get(ss.searchDelegateInput).click().type('genesis_51');
    cy.get(ss.delegateRow).should('have.length', 1);
  });
});
