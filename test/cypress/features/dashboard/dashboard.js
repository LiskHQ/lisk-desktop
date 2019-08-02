/* eslint-disable */
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import networks from '../../../constants/networks';
import ss from '../../../constants/selectors';
import accounts from '../../../constants/accounts';
import urls from '../../../constants/urls';

Given(/^I have a bookmark saved$/, function () {
  window.localStorage.setItem('bookmarks', `[{"title":"Alice","address":"${accounts.genesis.address}","balance":101}]`);
});
