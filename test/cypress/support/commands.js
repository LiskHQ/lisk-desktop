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
import networks from '../../constants/networks';

before(() => {
  // Check if lisk core is running
  cy.request(`${networks.devnet.node}/api/node/constants`).then(resp => expect(resp.status).to.eq(200));
});

beforeEach(() => {
  window.localStorage.setItem('settings', '{"onBoarding": false}');
});

Cypress.Commands.add('addToLocalStorage', (item, value) => {
  window.localStorage.setItem(item, value);
});

Cypress.Commands.add('addObjectToLocalStorage', (item, key, value) => {
  const itemString = window.localStorage.getItem(item);
  const itemObject = itemString ? JSON.parse(itemString) : {};
  itemObject[key] = value;
  window.localStorage.setItem(item, JSON.stringify(itemObject));
});

Cypress.Commands.add('autologin', (passphrase, network) => {
  localStorage.setItem('liskCoreUrl', network);
  localStorage.setItem('loginKey', passphrase);
});
