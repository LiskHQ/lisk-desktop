import actionTypes from './actionTypes';

/**
 * Trigger this action to log out of the account
 * while already logged in
 *
 * @returns {Object} - Action object
 */
export const setCurrentAccount = (encryptedAccount) => ({
  type: actionTypes.setCurrentAccount,
  encryptedAccount,
});

export const updateCurrentAccount = (accountDetail) => ({
  type: actionTypes.updateCurrentAccount,
  accountDetail,
});

export const addAccount = (encryptedAccount) => ({
  type: actionTypes.addAccount,
  encryptedAccount,
});

export const setAccountNonce = (address, nonce) => ({
  type: actionTypes.addAccount,
  address,
  nonce,
});

export const updateAccount = ({ encryptedAccount, accountDetail }) => ({
  type: actionTypes.updateAccount,
  encryptedAccount,
  accountDetail,
});

export const deleteAccount = (address) => ({
  type: actionTypes.deleteAccount,
  address,
});
