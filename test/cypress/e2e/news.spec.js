import accounts from '../../constants/accounts';
import networks from '../../constants/networks';

const ss = {
  newsBlock: '.news-item',
  editNewsFeed: '.settingsButton',
  settingsNewsFeedBlock: '.settingsNewsFeed',
};

const getSettingsObjFromLS = () => JSON.parse(localStorage.getItem('settings'));

beforeEach(() => {
  cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
});

describe('News', () => {
  it('Twitter is switched on by default', () => {
    cy.visit('/dashboard');
    cy.get(ss.newsBlock).contains('Twitter');
  });

  it('Twitter feed is not shown when is switched off', () => {
    cy.visit('/dashboard');
    cy.get(ss.editNewsFeed).click();
    cy.get(ss.settingsNewsFeedBlock).find('input').click({ force: true })
      .should(() => expect(getSettingsObjFromLS().channels.twitter).to.equal(false));
    cy.get(ss.editNewsFeed).click();
    cy.get(ss.newsBlock).should('not.exist');
  });

  it('Twitter feed is shown when is switched on', () => {
    cy.visit('/dashboard');
    cy.get(ss.editNewsFeed).click();
    cy.get(ss.settingsNewsFeedBlock).find('input').click({ force: true }).click({ force: true })
      .should(() => expect(getSettingsObjFromLS().channels.twitter).to.equal(true));
    cy.get(ss.editNewsFeed).click();
    cy.get(ss.newsBlock).contains('Twitter');
  });

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
