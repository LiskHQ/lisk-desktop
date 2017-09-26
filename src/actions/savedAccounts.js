import actionTypes from '../constants/actions';
import { getSavedAccount, setSavedAccount, removeSavedAccount } from '../utils/saveAccount';

/**
 * An action to dispatch accountSaved
 *
 */
export const accountSaved = (data) => {
  setSavedAccount(data);
  return {
    data,
    type: actionTypes.accountSaved,
  };
};

/**
 * An action to dispatch accountRemoved
 *
 * @todo Currently the utility removed the entire array from localStorage.
 *   it should remove only one item
 *
 */
export const accountRemoved = (publicKey) => {
  removeSavedAccount(publicKey);
  return {
    data: publicKey,
    type: actionTypes.accountRemoved,
  };
};

/**
 * The action to initiate savedAccounts store with the retrieved accounts
 *
 * @todo since the utility returns only one item, this action puts it in the array
 * eventually it should receive an array and return that to reducer
 *
 */
export const accountsRetrieved = () => {
  const accounts = getSavedAccount();
  const data = accounts !== undefined ? accounts : [];
  return {
    data,
    type: actionTypes.accountsRetrieved,
  };
};
