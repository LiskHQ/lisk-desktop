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
import settingConstants from '../../../src/modules/settings/const/settingConstants';
import { deepMergeObj } from '../../../src/utils/helpers';
import networks from '../../../src/modules/network/configuration/networks';

before(() => {
  // Check if lisk core is running
  cy.request(`${networks.customNode.serviceUrl}/api/v3/network/status`).then((resp) =>
    expect(resp.status).to.eq(200)
  );
});

beforeEach(() => {
  const settingsWithNetworkSelectorEnabled = { ...settingConstants, showNetwork: true };
  const lskSettings = deepMergeObj(settingsWithNetworkSelectorEnabled, {
    token: { list: { LSK: true } },
  });
  window.localStorage.setItem('settings', JSON.stringify(lskSettings));
  window.localStorage.setItem('serviceUrl', networks.customNode.serviceUrl);
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
  localStorage.setItem('liskServiceUrl', network);
  localStorage.setItem('loginKey', passphrase);
});

Cypress.Commands.add(
  'paste',
  { prevSubject: true },
  (subject, { pastePayload, pasteType = 'text' }) => {
    const data = pasteType === 'application/json' ? JSON.stringify(pastePayload) : pastePayload;
    const clipboardData = new DataTransfer();
    clipboardData.setData(pasteType, data);
    const pasteEvent = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      dataType: pasteType,
      data,
      clipboardData,
    });
    subject[0].dispatchEvent(pasteEvent);

    return subject;
  }
);
