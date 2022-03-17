/* eslint-disable */
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { accounts } from '../../../constants';

Given(/^I have a bookmark saved$/, function () {
  window.localStorage.setItem('bookmarks', `{"LSK":[{"title":"Alice","address":"${accounts.genesis.summary.address}","balance":101}],"BTC":[]}`);
});
