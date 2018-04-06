import actionTypes from '../constants/actions';
import {
  getSavedAccounts,
  getLastActiveAccount,
} from '../utils/savedAccounts';

/**
 * An action to dispatch accountSaved
 *
 */
export const accountSaved = account => ({
  data: account,
  type: actionTypes.accountSaved,
});

/**
 * An action to dispatch accountRemoved
 */
export const accountRemoved = account => ({
  data: account,
  type: actionTypes.accountRemoved,
});

/**
 * An action to dispatch accountSwitched
 */
export const accountSwitched = account => ({
  data: account,
  type: actionTypes.accountSwitched,
});

/**
 * The action to initiate savedAccounts store with the retrieved accounts
 *
 * @todo since the utility returns only one item, this action puts it in the array
 * eventually it should receive an array and return that to reducer
 *
 */
export const accountsRetrieved = () => ({
  data: {
    accounts: getSavedAccounts(),
    lastActive: getLastActiveAccount(),
  },
  type: actionTypes.accountsRetrieved,
});

/**
 * An action to dispatch activeAccountSaved
 */
export const activeAccountSaved = () => ({
  type: actionTypes.activeAccountSaved,
});

/**
 * An action to dispatch removeSavedAccountPassphrase
 * @param {Object} data - account data
 * @returns {Object} - Action object
 */
export const removeSavedAccountPassphrase = data => ({
  data,
  type: actionTypes.removeSavedAccountPassphrase,
});
