import { deepEquals } from '../../utils/polyfills';
import actionTypes from '../../constants/actions';

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
  const updatedAccount = Object.assign({}, account, {});

  keys.forEach((key) => {
    if (info[key]) {
      changes = setChangedItem(account, changes, key, info[key]);
      updatedAccount[key] = info[key];
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
    case actionTypes.removePassphrase:
      return Object.assign({}, state, { passphrase: null, expireTime: 0 });
    case actionTypes.accountUpdated:
      return merge(state, action.data);
    case actionTypes.transactionsInit:
      return { ...state, delegate: action.data.delegate };
    case actionTypes.accountLoggedIn:
      return action.data;
    case actionTypes.accountLoggedOut:
      return {
        afterLogout: true,
      };
    case actionTypes.accountLoading:
      return {
        loading: true,
      };
    default:
      return state;
  }
};

export default account;
