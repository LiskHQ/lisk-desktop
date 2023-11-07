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

export const setAccountNonce = (address, nonce, transactionHex, networkChainIDKey) => ({
  type: actionTypes.setAccountNonce,
  address,
  nonce,
  transactionHex,
  networkChainIDKey,
});

export const resetAccountNonce = (address, onChainNonce, networkChainIDKey) => ({
  type: actionTypes.resetAccountNonce,
  address,
  nonce: onChainNonce,
  networkChainIDKey,
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
