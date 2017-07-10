import Lisk from 'lisk-js';
import { deepEquals } from '../utils/polyfills';
import actionTypes from '../constants/actions';

/**
 * If the new value of the given property on the account is changed,
 * it sets the changed property with the values on a dictionary
 *
 * @private
 * @method setChangedItem
 * @param {Object} changes - The object to collect a dictionary of all the changes
 * @param {String} property - The name of the property to check if changed
 * @param {any} value - The new value of the property
 */
const setChangedItem = (account, changes, property, value) =>
  Object.assign({}, changes, (() => {
    const obj = {};

    if (!deepEquals(account[property], value)) {
      obj[property] = [account[property], value];
    }
    return obj;
  })());

/**
 * Merges account object with given info object
 * and if info contains passphrase, it also sets
 * the values of address and publicKey
 *
 * @param {Object} account - Account object
 * @param {Object} info - New changes
 *
 * @returns {Object} the updated account object
 */
const merge = (account, info) => {
  const keys = Object.keys(info);
  let changes = {};
  const updatedAccount = Object.assign({}, account);

  keys.forEach((key) => {
    changes = setChangedItem(account, changes, key, info[key]);
    updatedAccount[key] = info[key];

    if (key === 'passphrase') {
      const kp = Lisk.crypto.getKeys(info[key]);
      changes = setChangedItem(account, changes, 'publicKey', kp.publicKey);
      updatedAccount.publicKey = kp.publicKey;

      const address = Lisk.crypto.getAddress(kp.publicKey);
      changes = setChangedItem(account, changes, 'address', address);
      updatedAccount.address = address;
    }
  });

  return updatedAccount;
};

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const account = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.accountUpdated:
      return merge(state, action.data);
    case actionTypes.accountLoggedOut:
      return {};
    default:
      return state;
  }
};

export default account;
