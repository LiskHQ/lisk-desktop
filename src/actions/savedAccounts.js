import actionTypes from '../constants/actions';
import {
  getSavedAccounts,
  setSavedAccount,
  removeSavedAccount,
  setLastActiveAccount,
  getLastActiveAccount,
} from '../utils/savedAccounts';

/**
 * An action to dispatch accountSaved
 *
 */
export const accountSaved = (account) => {
  setSavedAccount(account);
  setLastActiveAccount(account);
  return {
    data: account,
    type: actionTypes.accountSaved,
  };
};

/**
 * An action to dispatch accountRemoved
 */
export const accountRemoved = (account) => {
  removeSavedAccount(account);
  return {
    data: account,
    type: actionTypes.accountRemoved,
  };
};

/**
 * An action to dispatch accountSwitched
 */
export const accountSwitched = (account) => {
  setLastActiveAccount(account);
  return {
    data: account,
    type: actionTypes.accountSwitched,
  };
};

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
