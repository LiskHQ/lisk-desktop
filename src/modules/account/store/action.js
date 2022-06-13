/* eslint-disable max-lines */
import actionTypes from './actionTypes';

/**
 * Trigger this action to log out of the account
 * while already logged in
 *
 * @returns {Object} - Action object
 */
// eslint-disable-next-line import/prefer-default-export
export const setCurrentAccount = (encryptedAccount) => ({
  type: actionTypes.setCurrentAccount,
  encryptedAccount,
});

export const addAccount = (encryptedAccount) => ({
  type: actionTypes.addAccount,
  encryptedAccount,
});

export const removeAccount = (address) => ({
  type: actionTypes.removeAccount,
  address,
});
