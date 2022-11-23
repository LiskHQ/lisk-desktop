/* eslint-disable max-lines */
import actionTypes from './actionTypes';

/** export const accountLoading = () => ({
  type: actionTypes.accountLoading,
}); */

/**
 * This action is used on login to fetch account info for all enabled token
 *
 * @param {Object} data - for hardware wallets it contains publicKey and hwInfo,
 *    otherwise contains passphrase
 * @param {String} data.passphrase - BIP39 passphrase of the account
 * @param {String} data.publicKey - Lisk publicKey used for hardware wallet login
 * @param {Object} data.hwInfo - info about hardware wallet we're trying to login to
 */

/**
 * Store second passphrase in the Redux store
 *
 * @param {string} passphrase - Valid Mnemonic passphrase
 * @returns {object} Pure action object
 */
export const secondPassphraseStored = (passphrase) => ({
  type: actionTypes.secondPassphraseStored,
  data: passphrase,
});

/**
 * Removes the second passphrase from the Redux store
 *
 * @returns {object} Pure action object
 */
export const secondPassphraseRemoved = () => ({
  type: actionTypes.secondPassphraseRemoved,
});
