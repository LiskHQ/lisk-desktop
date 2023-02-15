import actionTypes from './actionTypes';

export const storeHWAccounts = (accounts) => ({
  type: actionTypes.storeHWAccounts,
  accounts,
});

export const removeHWAccounts = () => ({
  type: actionTypes.removeHWAccounts,
});
