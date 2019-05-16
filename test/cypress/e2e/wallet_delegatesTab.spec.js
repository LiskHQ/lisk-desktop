import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';

describe('Wallet Delegate tab', () => {
  it('Shows delegate statistics for himself', () => {
    cy.autologin(accounts.delegate.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.delegateStatisticsTab).click();
    cy.get(ss.delegateStatsRank).contains(/\d/);
    cy.get(ss.delegateStatsUptime).contains(/\d%/);
    cy.get(ss.delegateStatsApproval).contains(/\d%/);
    cy.get(ss.delegateStatsWeight).contains(/\d LSK/);
    cy.get(ss.delegateStatsForged).contains(/\d LSK/);
    cy.get(ss.delegateStatsBlocks).contains(/\d/);
    cy.get(ss.delegateStatsSince).contains(/\d{2}\s\w{3}\s\d{2}/);
    cy.get(ss.delegateStatsLastBlock).contains(/\d{2}\s\w{3}\s\d{2}/);
  });

  it('Shows delegate statistics for other', () => {
    cy.server();
    cy.route('/api/accounts?address=**').as('requestAccountData');
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.accounts}/${accounts.delegate.address}`);
    cy.wait('@requestAccountData');
    cy.get(ss.delegateStatisticsTab).should('be.visible');
    cy.get(ss.delegateStatisticsTab).click();
    cy.get(ss.delegateStatsUptime).contains(/\d%/);
  });

  it('Not there for non-delegate himself', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.delegateStatisticsTab).should('not.exist');
  });

  it('Not there for non-delegate for other', () => {
    cy.autologin(accounts.delegate.passphrase, networks.devnet.node);
    cy.visit(`${urls.accounts}/${accounts.genesis.address}`);
    cy.get(ss.delegateStatisticsTab).should('not.exist');
  });
});
