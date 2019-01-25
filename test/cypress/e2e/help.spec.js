import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';

const checkHelpPageLoaded = () => cy.get(ss.takeTutorial);

const getSettingsObjFromLS = () => JSON.parse(localStorage.getItem('settings'));

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
  it('opens by sidebar button', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit('/');
    cy.get(ss.sidebarMenuHelpBtn).should('have.css', 'opacity', '1').click();
    cy.url().should('contain', urls.help);
    checkHelpPageLoaded();
  });

  describe('Onboarding', () => {
    beforeEach(() => {
      cy.clearLocalStorage(); // To remove onBoarding: false
    });

    /**
     * Tutorial does not start on app start
     */
    it('does not start when not logged in, onBoarding = true', () => {
      cy.addObjectToLocalStorage('settings', 'onBoarding', true);
      cy.visit('/');
      cy.get(ss.tutorialTooltip).should('not.exist');
    });

    /**
     * Tutorial does not start after sign in if onBoarding is set to false
     */
    it('does not start when logged in, onBoarding = false', () => {
      cy.addObjectToLocalStorage('settings', 'onBoarding', false);
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit('/');
      cy.get(ss.tutorialTooltip).should('not.exist');
    });

    /**
     * Tutorial start after sign in if onBoarding is not set
     * Go through tutorial
     * @expect onBoarding is set to false
     */
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
      // this should be enabled once Joyride can open the dropdown on topBar
      // cy.get(ss.onBoardingHeader).should('have.text', 'Access extra features');
      // cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('have.text', 'You’ve completed the tour!');
      cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('not.exist')
        .and(() => expect(getSettingsObjFromLS().onBoarding).to.equal(false));
    });

    /**
     * Link for tutorial is not there if not logged in
     * @expect no start tutorial link
     */
    it('link for onboarding is not there if not logged in', () => {
      cy.visit(urls.help);
      cy.get(ss.startOnBoardingLink).should('not.exist');
    });

    /**
     * Link for tutorial is there if not logged in
     * Go through tutorial
     * @expect onBoarding is set to false
     */
    it('link is there if logged in, go through onboarding', () => {
      cy.addObjectToLocalStorage('settings', 'onBoarding', false);
      cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
      cy.visit(urls.help);
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
      // cy.get(ss.onBoardingHeader).should('have.text', 'Manage your application');
      // cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      // cy.get(ss.onBoardingHeader).should('have.text', 'Access extra features');
      // cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('have.text', 'You’ve completed the tour!');
      cy.get(ss.onBoardingTooltipPrimaryBtn).click();
      cy.get(ss.onBoardingHeader).should('not.exist')
        .and(() => expect(getSettingsObjFromLS().onBoarding).to.equal(false));
    });

    /**
     * Skip tutorial in the middle
     * @expect onBoarding is set to false
     */
    it('skip onboarding in the process', () => {
      cy.addObjectToLocalStorage('settings', 'onBoarding', true);
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
