/* eslint-disable */
import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { networks, urls, wallets, ss, settings } from '../../../constants';

const txConfirmationTimeout = 15000;

Given(/^Network switcher is (enabled|disabled)$/, function (status) {
  const showNetwork = status === 'enabled';
  window.localStorage.setItem(
    'settings',
    JSON.stringify({ ...settings, showNetwork: showNetwork })
  );
});

Given(/^Network is set to testnet$/, function () {
  window.localStorage.setItem(
    'settings',
    JSON.stringify({
      ...settings,
      showNetwork: true,
      network: { name: 'testnet', address: 'https://testnet-service.lisk.com' },
    })
  );
});

Given(/^Network is set to ([^\s]+)$/, function (network) {
  window.localStorage.setItem(
    'settings',
    JSON.stringify({
      ...settings,
      showNetwork: true,
      network: { name: network, address: networks[network].serviceUrl },
    })
  );
});

/** Given(/^I login as ([^\s]+) on ([^\s]+)$/, function (account, network) {
  cy.visit(urls.login);
  cy.get(ss.networkDropdown).click();
  cy.get(ss.networkOptions).eq(2).click();
  cy.get(ss.addressInput).clear().type(networks[network].serviceUrl);
  cy.get(ss.connectButton).click();

  cy.get(ss.passphraseInput).first().click();
  cy.get(ss.passphraseInput).each(($el, index) => {
    const passphraseWordsArray = wallets[account].passphrase.split(' ');
    cy.wrap($el, { log: false }).type(passphraseWordsArray[index], { log: false });
  });
  cy.get(ss.loginBtn).should('be.enabled');
  cy.get(ss.loginBtn).click();
});

Given(/^I login$/, function () {
  cy.server();
  cy.get(ss.loginBtn).should('be.enabled');
  cy.get(ss.loginBtn).click();
}); */

Then(/^I enter the passphrase of ([^\s]+)$/, function (accountName) {
  const passphrase = wallets[accountName]['passphrase'];
  cy.get(ss.passphraseInput).first().click();
  cy.get(ss.passphraseInput).each(($el, index) => {
    const passphraseWordsArray = passphrase.split(' ');
    cy.wrap($el).type(passphraseWordsArray[index]);
  });
});

When(/^I enter the passphrase of ([^\s]+) on ([^\s]+)$/, function (accountName, network) {
  cy.get(ss.networkDropdown).click();
  cy.get(ss.networkOptions).eq(2).click();
  cy.get(ss.addressInput).clear().type(networks[network].serviceUrl);
  cy.get(ss.connectButton).click();

  const passphrase = wallets[accountName]['passphrase'];
  cy.get(ss.passphraseInput).first().click();
  cy.get(ss.passphraseInput).each(($el, index) => {
    const passphraseWordsArray = passphrase.split(' ');
    cy.wrap($el).type(passphraseWordsArray[index]);
  });
});

Given(/^I am on (.*?) page$/, function (page) {
  page = page.toLowerCase();
  cy.server();
  switch (page) {
    case 'register validator':
      cy.visit(urls.registerValidator);
      break;
    default:
      cy.visit(urls[page]);
      break;
  }
});

Given(/^I am on (.*?) page of (.*?)$/, function (page, identifier) {
  cy.server();
  switch (page.toLowerCase()) {
    case 'wallet':
      cy.visit(`${urls.wallet}?address=${wallets[identifier].summary.address}`);
      break;
  }
});

Given(/^I scroll from (.*?) to (.*?)$/, (elementName, position) => {
  cy.get(ss[elementName]).scrollTo(position, { ensureScrollable: false });
});

Then(/^I should see pending transaction$/, function () {
  cy.get(`${ss.transactionRow} ${ss.spinner}`).should('be.visible');
});

Then(/^I should not see pending transaction$/, function () {
  cy.get(`${ss.transactionRow} ${ss.spinner}`, { timeout: txConfirmationTimeout }).should(
    'be.not.visible'
  );
});

Then(/^I see this title: (.*?)$/, function (title) {
  cy.get(ss.app).contains(title);
});

Then(/^The latest transaction is (.*?)$/, function (transactionType) {
  cy.wait(1000);
  if (transactionType.toLowerCase().indexOf('transfer') > -1) {
    const transactionRecipient = transactionType.split(' ').pop();
    if (transactionRecipient === 'random') {
      /* For use: 'transfer to random' */
      cy.get(`${ss.transactionRow} ${ss.transactionAddress}`)
        .eq(0)
        .should('have.text', this.randomAddress);
    } else if (transactionRecipient === 'transfer') {
      throw new Error(
        'Usage: "transfer to {recipient}" where recipient could be "random" or account name'
      );
    } else {
      /* For uses like: 'transfer to mkakDp2f31btaXdATtAogoqwXcdx1PqqFo' */
      cy.get(`${ss.transactionRow} ${ss.transactionRowRecipient} span`)
        .eq(0)
        .contains(transactionRecipient.substring(0, 10));
    }
  }
  switch (transactionType.toLowerCase()) {
    case 'unlocking':
      cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).contains('Unlock');
      break;
    case 'staking':
      cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).contains('Validator stake');
      break;
    case 'validator registration':
      cy.get(`${ss.transactionRow} ${ss.transactionAddress}`)
        .eq(0)
        .contains('Validator registration');
      break;
    case 'register validator':
      cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).contains('Register validator');
      break;
    case 'register multisignature group':
      cy.get(`${ss.transactionRow} ${ss.transactionAddress}`)
        .eq(0)
        .contains('Register multisig. group');
      break;
    case 'stake':
      cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).contains('Stake');
      break;
  }
});

Then(
  /^The latest transaction in monitor is sent by (.*?) and recipient is (.*?)$/,
  function (sender, recipient) {
    cy.wait(1000);
    cy.get(`${ss.transactionRowSender}`).eq(0).contains(sender);
    cy.get(`${ss.transactionRowRecipient}`).eq(0).contains(recipient);
  }
);

Then(/^I should be on (.*?) page$/, function (pageName) {
  switch (pageName.toLowerCase()) {
    case 'tx details':
      cy.get(ss.app).contains('Confirmations');
      break;
    case 'account':
      cy.get(ss.accountName).should('be.visible');
      break;
    case 'managed application list':
      cy.contains('Add application').eq(0).should('be.visible');
      break;
    case 'wallet':
      cy.url().should('include', 'wallet');
      break;
    case 'request token modal':
      cy.hash().should('eq', '#/wallet?tab=Transactions&modal=request');
      break;
  }
});

Then(/^I should see (\d+) (\w+) in table$/, function (number, rowType) {
  switch (rowType) {
    case 'transactions':
      cy.get(ss.transactionRow).should('have.length', number);
      break;
    case 'stakes':
      cy.get(ss.transactionRow).should('have.length', number);
      break;
    case 'validators':
      cy.get(ss.validatorRow).should('have.length', number);
      break;
  }
});

Then(/^I should see (.*?)$/, function (elementName) {
  cy.get(ss[elementName]).should('be.visible');
});

Then(/^(.*?) should not exist$/, function (elementName) {
  cy.get(ss[elementName]).should('not.exist');
});

Then(/^I should be on (.*?) page of (.*?)$/, function (pageName, identifier) {
  switch (pageName.toLowerCase()) {
    case 'account':
      cy.get(ss.accountName).contains(identifier.substr(0, 10));
      break;
    case 'validators':
      cy.get(ss.accountName).should('have.text', identifier);
      break;
    case 'tx details':
      cy.get(ss.transactionId).should('have.text', identifier);
      break;
    case 'wallet':
      cy.server();
      cy.visit(`${urls.accounts}/${wallets[identifier].address}`);
  }
});

Then(/^I click on (.*?)$/, function (elementName) {
  cy.wait(100);
  cy.get(ss[elementName]).eq(0).click();
});

Given(/^I click on (.*?)$/, function (elementName) {
  cy.wait(100);
  cy.get(ss[elementName]).eq(0).click();
});

When(/^I click on (.*?)$/, function (elementName) {
  cy.wait(100);
  cy.get(ss[elementName]).eq(0).click();
});

When(/^I clear input (.*?)$/, function (elementName) {
  cy.get(ss[elementName]).clear();
});

When(/^I fill ([\w]+) in ([\w]+) field$/, function (value, field) {
  cy.get(ss[field]).type(value);
});

Then(/^I fill ([^s]+) in ([^s]+) field$/, function (value, field) {
  cy.get(ss[field]).type(value);
});

When(/^I paste ([\w]+) in ([\w]+) field$/, function (value, field) {
  cy.get(ss[field])
    .clear()
    .invoke('val', value.slice(0, value.length - 1))
    .type(value.slice(-1));
});

Then(/^I go to transfer confirmation$/, function () {
  cy.get(ss.txNextBtn).should('be.enabled');
  cy.get(ss.txNextBtn).click();
});

Then(/^(.*?) should be visible$/, function (elementName) {
  cy.get(ss[elementName]).should('be.visible');
});

Then(/^The (.*?) button must (.*?) active$/, function (elementName, check) {
  if (check === 'be') {
    cy.get(ss[elementName]).should('not.be.disabled');
  } else if (check === 'not be') {
    cy.get(ss[elementName]).should('be.disabled');
  }
});

And(/^I search for account (.*?)$/, function (string) {
  cy.server();
  cy.get(ss.searchInput).type(string);
});

Then(/^I wait (.*?) seconds$/, function (seconds) {
  cy.wait(Number(seconds) * 1000);
});

When(/^I sort by (\w+)$/, function (sortParam) {
  cy.wait(100);
  cy.get(`${ss.sortByBtn}.${sortParam}`).eq(0).click();
});

Given(/^I open (\w+) modal$/, function (modal) {
  cy.visit(`${urls.wallet}?modal=${modal}`);
});
