import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';

describe('Wallet Votes tab', () => {
  beforeEach(() => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.votesTab).click();
  });
  /**
   * Maximum possible number of voted accounts is shown
   * @expect more votes are present
   */
  it('30 votes are shown, clicking show more loads more votes', () => {
    cy.get(ss.voteRow).should('have.length', 30);
    cy.get(ss.showMoreVotesBtn).click();
    cy.get(ss.voteRow).should('have.length.greaterThan', 30);
  });

  it('Filtering votes works', () => {
    cy.get(ss.searchDelegateInput).click().type('genesis_17');
    cy.get(ss.voteRow).should('have.length', 1);
  });

  /**
   * Click on voted delegate leads to account page
   * @expect corresponding delegate name is shown on account's page
   */
  it('Click on voted delegate leads to account page', () => {
    cy.get(ss.voteRow).eq(0).click();
    cy.get(ss.accountName).contains('genesis');
  });
});
