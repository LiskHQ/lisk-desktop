import { tokenMap } from '../../constants/tokens';
import * as btcAccount from './btc/account';
// import * as btcTransactions from './btc/transactions';
// import * as btcService from './btc/service';

/**
 * Resource oriented mapping from token type to utility functions.
 */
const resourceMap = {
  [tokenMap.BTC.key]: {
    account: btcAccount,
    transactions: 'btcTransactions',
    service: 'btcService',
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
