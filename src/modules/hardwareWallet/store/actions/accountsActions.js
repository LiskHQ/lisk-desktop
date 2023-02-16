import actionTypes from './actionTypes';

export const setHWAccounts = (accounts) => ({
  type: actionTypes.storeHWAccounts,
  accounts,
});

export const removeHWAccounts = () => ({
  type: actionTypes.removeHWAccounts,
});
