import { tokenMap } from '../../constants/tokens';
import * as btcAccount from './btc/account';
import * as btcNetwork from './btc/network';
import * as btcService from './btc/service';
import * as btcTransactions from './btc/transactions';
import * as lskAccount from './lsk/account';
import * as lskNetwork from './lsk/network';
import * as lskService from './lsk/liskService';
import * as lskTransactions from './lsk/transactions';

/**
 * Resource oriented mapping from token type to utility functions.
 */
const resourceMap = {
  [tokenMap.LSK.key]: {
    account: lskAccount,
    network: lskNetwork,
    service: lskService.default,
    transactions: lskTransactions,
  },
  [tokenMap.BTC.key]: {
    account: btcAccount,
    network: btcNetwork,
    service: btcService,
    transactions: btcTransactions,
  },
};

/**
 * Extracts related account API utility for given tokenType and map address.
 * @param {String} tokenType - eg. (BTC, LSK)
 * @param {String} resourceName - key path for the resource, eg: account
 * @param {String} functionName - key path for the utility function, eg: getSummary
 * @returns {Function}
 */
const getMappedFunction = (tokenType, resourceName, functionName) => {
  try {
    const fn = resourceMap[tokenType][resourceName][functionName];

    if (typeof fn === 'function') {
      return fn;
    }

    throw new Error(`${tokenType} doesn't match a function for ${resourceName}.${functionName}.`);
  } catch (error) {
    throw new Error(`Invalid mapper path for ${tokenType} - ${resourceName}.${functionName}.`);
  }
};

export default getMappedFunction;
