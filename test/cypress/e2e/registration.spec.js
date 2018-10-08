import networks from '../../constants/networks';

const ss = {
  networkDropdown: '.network',
  networkStatus: '.network-status',
  newAccountBtn: '.new-account-button',
  nodeAddress: '.peer',
  errorPopup: '.toast',
};

/**
 * Generates a sequence of random pairs of x,y coordinates on the screen that simulates
 * the movement of mouse to produce a pass phrase.
 */
const moveMouseRandomly = () => {
  for (let i = 0; i < 70; i += 1) {
    cy.get('main').first().trigger('mousemove', {
      which: 1,
      pageX: 500 + (Math.floor((((i % 2) * 2) - 1) * (249 + (Math.random() * 250)))),
      pageY: 500 + (Math.floor((((i % 2) * 2) - 1) * (249 + (Math.random() * 250)))),
    });
  }
};

const chooseNetwork = (network) => {
  switch (network) {
    case 'main':
      cy.get(ss.networkDropdown).click();
      cy.get('ul li').eq(1).click();
      break;
    case 'test':
      cy.get(ss.networkDropdown).click();
      cy.get('ul li').eq(2).click();
      break;
    case 'dev':
      cy.get(ss.networkDropdown).click();
      cy.get('ul li').eq(3).click();
      cy.get('.address input').type(networks.devnet.node);
      break;
    case 'invalid':
      cy.get(ss.networkDropdown).click();
      cy.get('ul li').eq(3).click();
      cy.get('.address input').type('http://silk.road');
      break;
    default:
      throw new Error(`Network should be one of : main , test, dev, invalid . Was: ${network}`);
  }
};

const registerUI = function () {
  moveMouseRandomly();
  cy.get('.get-passphrase-button').click();
  cy.get('.i-understand-checkbox').click();
  cy.get('.reveal-checkbox')
    .trigger('mousedown')
    .trigger('mousemove', { which: 1, pageX: 100, pageY: 0 })
    .trigger('mouseup');
  cy.get('textarea.passphrase').invoke('text').as('passphrase');
  cy.get('.yes-its-safe-button').click();
  cy.get('.passphrase-holder label').each(($el) => {
    if (this.passphrase.includes($el[0].textContent)) cy.wrap($el).click();
  });
  cy.get('.get-to-your-dashboard-button').click();
};

describe('Registration', () => {
  it('Create Lisk ID for Mainnet by default ("Switch Network" is not set)', function () {
    cy.visit('/register');
    registerUI.call(this);
    cy.get(ss.networkStatus).should('not.exist');
  });

  it('Create Lisk ID for Mainnet ("Switch Network" is false)', function () {
    cy.addLocalStorage('settings', 'showNetwork', false);
    cy.visit('/register');
    registerUI.call(this);
    cy.get(ss.networkStatus).should('not.exist');
  });

  it('Create Lisk ID for Mainnet (Selected network)', function () {
    cy.addLocalStorage('settings', 'showNetwork', true);
    cy.visit('/');
    chooseNetwork('main');
    cy.get(ss.newAccountBtn).click();
    registerUI.call(this);
    cy.get(ss.networkStatus).should('not.exist');
  });

  it('Create Lisk ID for Testnet', function () {
    cy.addLocalStorage('settings', 'showNetwork', true);
    cy.visit('/');
    chooseNetwork('test');
    cy.get(ss.newAccountBtn).click();
    registerUI.call(this);
    cy.get(ss.networkStatus).contains('Connected to testnet');
  });

  // TODO: unskip after #1326 fixed
  it.skip('Create Lisk ID for Devnet', function () {
    cy.addLocalStorage('settings', 'showNetwork', true);
    cy.visit('/');
    chooseNetwork('dev');
    cy.get(ss.newAccountBtn).click();
    registerUI.call(this);
    cy.get(ss.networkStatus).contains('Connected to devnet');
    cy.get(ss.nodeAddress).contains(networks.devnet.node);
  });

  // TODO: unskip after #1326 fixed
  it.skip('Create Lisk ID for invalid address', function () {
    cy.addLocalStorage('settings', 'showNetwork', true);
    cy.visit('/');
    chooseNetwork('invalid');
    cy.get(ss.newAccountBtn).click();
    registerUI.call(this);
    cy.get(ss.errorPopup).contains('Unable to connect to the node');
  });
});
