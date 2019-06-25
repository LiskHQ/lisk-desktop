/* eslint-disable */
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import networks from '../../../constants/networks';
import ss from '../../../constants/selectors';
import urls from '../../../constants/urls';
import accounts from '../../../constants/accounts';
import compareBalances from '../../utils/compareBalances';

const txConfirmationTimeout = 12000;
const transactionFee = 0.1;

const getRandomAddress = () => `23495548666${Math.floor((Math.random() * 8990000) + 1000000)}L`;
const getRandomAmount = () => Math.floor((Math.random() * 10) + 1);
const getRandomReference = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

let randomAddress;
let randomAmount;
let randomReference;

Given(/^I am on Send page$/, function () {
  cy.visit(urls.send);
});

Given(/^I autologin as ([^\s]+) to ([^\s]+)$/, function (account, network) {
  localStorage.setItem('liskCoreUrl', networks[network].node);
  localStorage.setItem('loginKey', accounts[account].passphrase);
});

Given(/^I remember my balance$/, function () {
  cy.get(ss.headerBalance).invoke('text').as('balanceBefore');
});

Then(/^I fill in recipient$/, function () {
  randomAddress = getRandomAddress();
  cy.get(ss.recipientInput).type(randomAddress);
});

Then(/^I fill in amount$/, function () {
  randomAmount = getRandomAmount();
  cy.get(ss.amountInput).click().type(randomAmount);
});

Then(/^I fill in message$/, function () {
  randomReference = getRandomReference();
  cy.get(ss.sendReferenceText).click().type(randomReference);
});

Then(/^I go to confirmation$/, function () {
  cy.get(ss.nextTransferBtn).click();
});

Then(/^I confirm transfer$/, function () {
  cy.get(ss.sendBtn).click();
  cy.get(ss.submittedTransactionMessage).should('be.visible');
});

Then(/^I click ok$/, function () {
  cy.get(ss.okayBtn).click();
});

Then(/^I see the transaction in transaction list$/, function () {
  cy.get(`${ss.transactionRow} ${ss.spinner}`).should('be.visible');
  cy.get(`${ss.transactionRow} ${ss.transactionAddress}`).eq(0).should('have.text', randomAddress);
  cy.get(`${ss.transactionRow} ${ss.transactionAmount}`).eq(0).should('have.text', `- ${randomAmount} LSK`);
  cy.get(`${ss.transactionRow} ${ss.spinner}`, { timeout: txConfirmationTimeout }).should('be.not.visible');
});

Then(/^The balance is subtracted$/, function () {
  cy.get(ss.headerBalance).invoke('text').as('balanceAfter').then(function () {
    compareBalances(this.balanceBefore, this.balanceAfter, randomAmount + transactionFee);
  });
});




