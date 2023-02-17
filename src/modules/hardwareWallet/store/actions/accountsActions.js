import actionTypes from './actionTypes';

export const setHWAccounts = (accounts) => ({
  type: actionTypes.setHWAccounts,
  accounts,
});

export const removeHWAccounts = () => ({
  type: actionTypes.removeHWAccounts,
});
