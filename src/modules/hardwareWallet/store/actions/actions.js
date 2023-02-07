import actionTypes from './actionTypes';

export const storeAccounts = (accounts) => ({
  type: actionTypes.storeAccounts,
  accounts,
});

export const removeAccounts = () => ({
  type: actionTypes.removeAccounts,
});
