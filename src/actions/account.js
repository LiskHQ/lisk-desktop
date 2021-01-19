import { to } from 'await-to-js';
import { toast } from 'react-toastify';
import { getAccount } from '../utils/api/account';
import { getConnectionErrorMessage } from '../utils/getNetwork';
import loginTypes from '../constants/loginTypes';
import { networkStatusUpdated } from './network';
import actionTypes from '../constants/actions';
import { tokenMap } from '../constants/tokens';

/**
 * Trigger this action to remove passphrase from account object
 *
 * @param {Object} data - account data
 * @returns {Object} - Action object
 */
export const removePassphrase = data => ({
  data,
  type: actionTypes.removePassphrase,
});

/**
 * Trigger this action to update the account object
 * while already logged in
 *
 * @param {Object} data - account data
 * @returns {Object} - Action object
 */
export const accountUpdated = data => ({
  data,
  type: actionTypes.accountUpdated,
});

/**
 * Trigger this action to log out of the account
 * while already logged in
 *
 * @returns {Object} - Action object
 */
export const accountLoggedOut = () => ({
  type: actionTypes.accountLoggedOut,
});

/**
 * Fires an action to reset the account automatic sign out timer
 * @param {Date} date - Current date
 */
export const timerReset = date => ({
  type: actionTypes.timerReset,
  data: date,
});

/**
 * Trigger this action to login to an account
 * The login middleware triggers this action
 *
 * @param {Object} data - account data
 * @returns {Object} - Action object
 */
export const accountLoggedIn = data => ({
  type: actionTypes.accountLoggedIn,
  data,
});

export const accountLoading = () => ({
  type: actionTypes.accountLoading,
});

/**
 * Updated Date on which passphrase was used last.
 * We determine the inactivity duration to sign out automatically
 *
 * @param {Date} data - A native Javascript date object.
 */
export const passphraseUsed = data => ({
  type: actionTypes.passphraseUsed,
  data,
});

/**
 * This action is used to update account balance when new block was forged and
 * account middleware detected that it contains a transaction that affects balance
 * of the active account
 *
 * @param {Object} data
 * @param {Object} data.account - current account with address and publicKey
 */
export const accountDataUpdated = ({ account }) =>
  async (dispatch, getState) => {
    const network = getState().network;
    const activeToken = getState().settings.token.active;
    const [error, result] = await to(getAccount({
      network,
      address: account.address,
      publicKey: account.publicKey,
    }, activeToken));
    if (result) {
      dispatch(accountUpdated(result));
      dispatch(networkStatusUpdated({ online: true }));
    } else {
      dispatch(networkStatusUpdated({ online: false, code: error.error.code }));
    }
  };


async function getAccounts(tokens, options) {
  return tokens.reduce(async (accountsPromise, token) => {
    const accounts = await accountsPromise;
    const { network, ...params } = options;
    const baseUrl = network.networks[token].serviceUrl;
    const account = await getAccount({ params, network, baseUrl }, token);
    return {
      ...accounts,
      [token]: account,
    };
  }, Promise.resolve({}));
}

export const updateEnabledTokenAccount = token => async (dispatch, getState) => {
  const { network, account } = getState();
  const activeToken = getState().settings.token.active;
  if (token !== tokenMap.LSK.key) {
    const [error, result] = await to(getAccount({
      token,
      network,
      passphrase: account.passphrase,
    }, activeToken));
    if (error) {
      toast.error(getConnectionErrorMessage(error));
    } else {
      dispatch(accountUpdated(result));
    }
  }
};

/**
 * This action is used on login to fetch account info for all enabled token
 *
 * @param {Object} data - for hardware wallets it contains publicKey and hwInfo,
 *    otherwise contains passphrase
 * @param {String} data.passphrase - BIP39 passphrase of the account
 * @param {String} data.publicKey - Lisk publicKey used for hardware wallet login
 * @param {Object} data.hwInfo - info about hardware wallet we're trying to login to
 */
export const login = ({ passphrase, publicKey, hwInfo }) => async (dispatch, getState) => {
  const { network, settings } = getState();
  dispatch(accountLoading());

  const activeTokens = Object.keys(settings.token.list)
    .filter(key => settings.token.list[key]);
  const [error, info] = await to(getAccounts(activeTokens, {
    network, publicKey, passphrase,
  }));

  if (error) {
    toast.error(getConnectionErrorMessage(error));
    dispatch(accountLoggedOut());
  } else {
    const loginType = hwInfo
      ? ['trezor', 'ledger'].find(item => hwInfo.deviceModel.toLowerCase().indexOf(item) > -1)
      : 'passphrase';
    dispatch(accountLoggedIn({
      passphrase,
      loginType: loginTypes[loginType].code,
      hwInfo: hwInfo || {},
      date: new Date(),
      info,
    }));
  }
};
