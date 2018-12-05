import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';

const getSettingsObjFromLS = () => JSON.parse(localStorage.getItem('settings'));

beforeEach(() => {
  cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
});

describe('News', () => {
  /**
   * Twitter is switched on by default
   * @expect twitter news is in the feed
   */
  it('Twitter is switched on by default', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.newsBlock).contains('Twitter');
  });

  /**
   * Switch off twitter feed
   * @expect localStorage value is set to false
   * @expect twitter news are not shown in the feed
   */
  it('Switch off twitter feed, it is not shown when is switched off', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.editNewsFeed).click();
    cy.get(ss.settingsNewsFeedBlock).find('input').click({ force: true })
      .should(() => expect(getSettingsObjFromLS().channels.twitter).to.equal(false));
    cy.get(ss.editNewsFeed).click();
    cy.get(ss.newsBlock).should('not.exist');
  });

  /**
   * Switch on twitter feed
   * @expect localStorage value is set to true
   * @expect twitter news are shown in the feed
   */
  it('Switch on twitter feed, it is shown when is switched on', () => {
    cy.visit(urls.dashboard);
    cy.get(ss.editNewsFeed).click();
    cy.get(ss.settingsNewsFeedBlock).find('input').click({ force: true }).click({ force: true })
      .should(() => expect(getSettingsObjFromLS().channels.twitter).to.equal(true));
    cy.get(ss.editNewsFeed).click();
    cy.get(ss.newsBlock).contains('Twitter');
  });

  /**
   * Tweet text and link is shown and correct
   * @expect text shown equals one from api response
   * @expect link shown equals one from api response
   */
  it('Tweet text and link is shown and correct', () => {
    cy.server();
    cy.fixture('newsfeed/tweet.json').then((tweet) => {
      cy.route('GET', 'https://service.lisk.io/api/newsfeed', tweet);
      cy.visit('/dashboard');
      cy.get(ss.newsBlock).contains(tweet[0].content);
      cy.get(ss.newsBlock).find('a').should('have.attr', 'href').and('equal', tweet[0].url);
    });
  });
});
