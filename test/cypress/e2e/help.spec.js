import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';

const checkHelpPageLoaded = () => cy.get(ss.termsOfUseLink);

describe('Help', () => {
  /**
   * Help page can be opened by direct link
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  it(`opens by url ${urls.help}`, () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.help);
    cy.url().should('contain', urls.help);
    checkHelpPageLoaded();
  });

  /**
   * Help page can be opened clicking sidebar button
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  it('opens by help button', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit('/');
    cy.get(ss.userAccount).click();
    cy.get(ss.sidebarMenuHelpBtn).click();
    cy.url().should('contain', urls.help);
    checkHelpPageLoaded();
  });
});
