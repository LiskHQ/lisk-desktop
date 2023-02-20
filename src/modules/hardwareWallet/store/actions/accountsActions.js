import actionTypes from './actionTypes';

export const updateHWData = (data) => ({
  type: actionTypes.updateHWData,
  data,
});

export const setHWAccounts = (accounts) => ({
  type: actionTypes.setHWAccounts,
  accounts,
});

export const removeHWAccounts = () => ({
  type: actionTypes.removeHWAccounts,
});
