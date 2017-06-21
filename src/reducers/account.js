import { deepEquals } from '../utils/polyfills';
import Lisk from 'lisk-js';

/**
 * 
 */
const merge = (account, info) => {
  const keys = Object.keys(info);
  let changes = {};
  let updatedAccount = Object.assign({}, account);

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
 * If the new value of the given property on the account is changed,
 * it sets the changed property with the values on a dictionary
 *
 * @private
 * @method setChangedItem
 * @param {Object} changes - The object to collect a dictionary of all the changes
 * @param {String} property - The name of the property to check if changed
 * @param {any} value - The new value of the property
 */
const setChangedItem = (account, changes, property, value) => {
  return Object.assign({}, changes, () => {
    let obj = {};

    if (!equals(account[property], value)) {
      obj[property] = [account[property], value];
    }
    return obj;
  });
};

/**
 * 
 * @param {Array} state 
 * @param {Object} action 
 */
const account = (state = {}, action) => {
    switch (action.type) {
        case 'SET_ACCOUNT':
            let newState = merge(state, action.data);
            console.log('SET_ACCOUNT', state, newState);
            return newState;
        case 'RESET_ACCOUNT':
            return {};
        default:
            return state;
    }
};

export default account;
