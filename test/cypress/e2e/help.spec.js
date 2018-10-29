import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';

const ss = {
  sidebarMenuHelpBtn: '#help',
  startOnBoardingLink: '.help-onboarding',
  onBoardingTooltipPrimaryBtn: '.joyride-tooltip__button--primary',
  onBoardingSkipBtn: '.joyride-tooltip__button--skip',
  onBoardingHeader: '.joyride-tooltip__header',
};

const checkHelpPageLoaded = () => cy.get('.help-onboarding');

const getSettingsObjFromLS = () => JSON.parse(localStorage.getItem('settings'));

describe('Help', () => {
  it(`opens by url ${urls.help}`, () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.help);
    cy.url().should('contain', 'help');
    checkHelpPageLoaded();
  });

  it('opens by sidebar button', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit('/');
    cy.get(ss.sidebarMenuHelpBtn).click();
    cy.url().should('contain', 'help');
    checkHelpPageLoaded();
  });

  describe('Onboarding', () => {
    beforeEach(() => {
      cy.clearLocalStorage(); // To remove onBoarding: false
    });

    it('does not start when not logged in, onBoarding = true', () => {
      cy.addLocalStorage('settings', 'onBoarding', true);
      cy.visit('/');
      cy.get('.joyride-tooltip__header').should('not.exist');
    });

    it('does not start when logged in, onBoarding = false', () => {
      cy.addLocalStorage('settings', 'onBoarding', false);
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit('/');
      cy.get('.joyride-tooltip__header').should('not.exist');
    });

    it('pops up on clean login, go through onboarding', () => {
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit('/');
      cy.get(ss.onBoardingHeader).should('have.text', 'Welcome to Lisk Hub')
        .and(() => expect(getSettingsObjFromLS().onBoarding).to.equal(true));
      cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('have.text', 'Lisk ID');
      cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('have.text', 'Explore the network');
      cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('have.text', 'Keep the overview');
      cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('have.text', 'Send LSK');
      cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('have.text', 'Manage your application');
      cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('have.text', 'Access extra features');
      cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('have.text', 'You’ve completed the tour!');
      cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('not.exist')
        .and(() => expect(getSettingsObjFromLS().onBoarding).to.equal(false));
    });

    it('link for onboarding is not there if not logged in', () => {
      cy.visit(urls.help);
      cy.get(ss.startOnBoardingLink).should('not.exist');
    });

    it('link is there if logged in, go through onboarding', () => {
      cy.addLocalStorage('settings', 'onBoarding', false);
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit('/help');
      cy.get(ss.startOnBoardingLink).click();
      cy.get(ss.onBoardingHeader).should('have.text', 'Welcome to Lisk Hub');
      cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('have.text', 'Lisk ID');
      cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('have.text', 'Explore the network');
      cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('have.text', 'Keep the overview');
      cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('have.text', 'Send LSK');
      cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('have.text', 'Manage your application');
      cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('have.text', 'Access extra features');
      cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('have.text', 'You’ve completed the tour!');
      cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('not.exist')
        .and(() => expect(getSettingsObjFromLS().onBoarding).to.equal(false));
    });

    it('skip onboarding in the process', () => {
      cy.addLocalStorage('settings', 'onBoarding', true);
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit('/');
      cy.get(ss.onBoardingHeader).should('have.text', 'Welcome to Lisk Hub');
      cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('have.text', 'Lisk ID');
      cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingSkipBtn).click();
      cy.get(ss.onBoardingHeader).should('have.text', 'Onboarding whenever you need');
      cy.get(ss.onBoardingSkipBtn).click();
      cy.get(ss.onBoardingHeader).should('not.exist')
        .and(() => expect(getSettingsObjFromLS().onBoarding).to.equal(false));
    });
  });
});
