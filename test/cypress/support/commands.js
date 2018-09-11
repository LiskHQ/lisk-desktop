// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

beforeEach(() => {
  window.localStorage.setItem('settings', '{"onBoarding": false}');
});

Cypress.Commands.add('addLocalStorage', (item, key, value) => {
  const itemString = window.localStorage.getItem(item);
  const itemObject = itemString ? JSON.parse(itemString) : {};
  itemObject[key] = value;
  window.localStorage.setItem(item, JSON.stringify(itemObject));
});

Cypress.Commands.add('login', (account, network) => {
  const accounts = [];
  accounts.push({
    publicKey: account.publicKey,
    network,
    peerAddress: network === 2 ? Cypress.env('CORE_URL') : undefined,
  });
  window.localStorage.setItem('accounts', JSON.stringify(accounts));
});

Cypress.Commands.add('loginUI', (account, network) => {
  cy.visit('/');
  cy.addLocalStorage('settings', 'showNetwork', true);
  cy.reload();
  cy.get('.network').click();
  switch (network) {
    case 'main':
      cy.get('ul li').eq(1).click();
      break;
    case 'test':
      cy.get('ul li').eq(2).click();
      break;
    case 'dev':
      cy.get('ul li').eq(3).click();
      cy.get('.address input').type(Cypress.env('coreUrl'));
      break;
    default:
      throw new Error(`Network should be one of : main , test, dev . Was: , ${network}`);
  }
  cy.get('.passphrase input').click();
  cy.get('.passphrase input').each(($el, index) => {
    const passphraseWordsArray = account.passphrase.split(' ');
    cy.wrap($el).type(passphraseWordsArray[index]);
  });
  cy.get('.login-button').click();
  cy.get('.copy-title');
});
