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
import settings from '../../constants/settings';
import { deepMergeObj } from '../../../src/utils/helpers';

before(() => {
  // Check if lisk core is running
  cy.request(`${networks.devnet.node}/api/node/constants`).then(resp => expect(resp.status).to.eq(200));
  cy.request(`${networks.devnet.serviceUrl}/api/v1/network/status`).then(resp => expect(resp.status).to.eq(200));
});

beforeEach(() => {
  const btcSettings = deepMergeObj(
    settings,
    { token: { list: { BTC: true } } },
  );
  window.localStorage.setItem('settings', JSON.stringify(btcSettings));
  window.localStorage.setItem('serviceUrl', networks.devnet.serviceUrl);
});

Cypress.Commands.add('addToLocalStorage', (item, value) => {
  window.localStorage.setItem(item, value);
});

Cypress.Commands.add('mergeObjectWithLocalStorage', (item, data) => {
  const localStorageData = JSON.parse(window.localStorage.getItem(item)) || {};
  const newData = JSON.stringify(deepMergeObj(localStorageData, data));
  window.localStorage.setItem(item, newData);
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
