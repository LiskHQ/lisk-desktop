/* eslint-disable */
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { accounts, wallets } from '../../../constants';

Given(/^I have a bookmark saved$/, function () {
  window.localStorage.setItem(
    'bookmarks',
    `{"LSK":[{"title":"Alice","address":"${wallets.genesis.summary.address}","balance":101}]`
  );
});
