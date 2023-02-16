import actionTypes from './actionTypes';

export const updateHWData = (data) => ({
  type: actionTypes.updateHWData,
  data,
});

export const storeHWAccounts = (accounts) => ({
  type: actionTypes.storeHWAccounts,
  accounts,
});

export const removeHWAccounts = () => ({
  type: actionTypes.removeHWAccounts,
});
