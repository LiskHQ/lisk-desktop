import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import ss from '../../constants/selectors';
import urls from '../../constants/urls';

describe('Latest activity', () => {
  beforeEach(() => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.dashboard);
  });
  /**
   * 4 transaction are shown in the latest activity component
   * @expect 4 transactions visible
   */
  it('4 tx are shown by default', () => {
    cy.get(ss.transactionRow).eq(4).should('be.visible');
    cy.get(ss.transactionRow).eq(30).should('not.be.visible');
  });

  /**
   * 30 transaction are shown in the latest activity component after clicking Show more
   * @expect 30 transactions visible
   */
  it('30 tx are shown after Show More click', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.transactionRow).should('have.length', 30);
    cy.get(ss.showMoreButton).eq(0).click();
    cy.get(ss.transactionRow).eq(4).should('be.visible');
    cy.get(ss.transactionRow).eq(29).trigger('mouseover').should('be.visible');
  });

  /**
   * Click on transaction row leads to tx details page
   * @expect url
   * @expect some specific to page element is present on it
   */
  it('Click leads to tx details', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.transactionRow).eq(0).click();
    cy.get(ss.txSenderAddress).should('be.visible');
  });

  /**
   * 'See all transactions' link leads to wallet page
   * @expect url
   * @expect some specific to page element is present on it
   */
  it('See all leads to wallet activity', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.seeAllTxsBtn).click();
    cy.url().should('contain', `${urls.wallet}`);
    cy.get(ss.transactionRequestButton);
  });
});
