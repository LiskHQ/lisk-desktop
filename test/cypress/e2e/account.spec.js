import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';

describe('Account', () => {
  /**
   * Help page can be opened by direct link
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  it('Opens by url', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.accounts}/${accounts.delegate.address}`);
    cy.url().should('contain', accounts.delegate.address);
  });
});
