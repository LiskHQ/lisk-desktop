import actionTypes from './actionTypes';

export const setHWAccounts = (hwAccounts) => ({
  type: actionTypes.setHWAccounts,
  hwAccounts,
});

export const removeHWAccounts = () => ({
  type: actionTypes.removeHWAccounts,
});

export const updateHWAccount = (hwAccount) => ({
  type: actionTypes.updateHWAccount,
  hwAccount,
});
