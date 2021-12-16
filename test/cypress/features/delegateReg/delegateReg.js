/* eslint-disable */
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { urls, ss } from '../../../constants';

const txConfirmationTimeout = 12000;
const txDelegateRegPrice = 25;
const getRandomDelegateName = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

