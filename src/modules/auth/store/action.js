/* eslint-disable max-lines */
import { to } from 'await-to-js';
import { toast } from 'react-toastify';
import loginTypes from 'src/modules/auth/const/loginTypes';
import { tokenMap } from '@token/fungible/consts/tokens';
import { extractAddress as extractBitcoinAddress } from '@wallet/utils/api';
import { getConnectionErrorMessage } from '@network/utils/getNetwork';
import { extractKeyPair } from '@wallet/utils/account';
import { getAccounts } from '@wallet/store/action';
import { defaultDerivationPath } from 'src/utils/explicitBipKeyDerivation';
import actionTypes from './actionTypes';


/**
 * Fires an action to reset the account automatic sign out timer
 * @param {Date} date - Current date
 */
export const timerReset = () => ({
  type: actionTypes.timerReset,
  data: new Date(),
});

export const accountLoading = () => ({
  type: actionTypes.accountLoading,
});

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
