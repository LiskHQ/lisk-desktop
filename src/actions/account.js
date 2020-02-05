import { to } from 'await-to-js';
import i18next from 'i18next';
import { toast } from 'react-toastify';
import { extractAddress } from '../utils/account';
import { getAPIClient } from '../utils/api/network';
import { getAccount } from '../utils/api/account';
import { setSecondPassphrase } from '../utils/api/lsk/account';
import { getConnectionErrorMessage } from './network/lsk';
import { getTimeOffset } from '../utils/hacks';
import { loginType } from '../constants/hwConstants';
import { networkStatusUpdated } from './network';
import accountConfig from '../constants/account';
import actionTypes from '../constants/actions';
import { tokenMap } from '../constants/tokens';
import { txAdapter } from '../utils/api/lsk/adapters';

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

export const passphraseUsed = data => ({
  type: actionTypes.passphraseUsed,
  data,
});

// TODO delete this action and use setSecondPassphrase with withData HOC
// directly in the Second passphrase registration component
export const secondPassphraseRegistered = ({
  secondPassphrase, account, passphrase, callback,
}) =>
/* istanbul ignore next */
  (dispatch, getState) => {
    const { settings: { token: { active } }, network } = getState();
    const { networkIdentifier } = network.networks.LSK;
    const liskAPIClient = getAPIClient(active, getState());
    const timeOffset = getTimeOffset(getState().blocks.latestBlocks);
    setSecondPassphrase(
      liskAPIClient,
      secondPassphrase,
      account.publicKey,
      passphrase,
      timeOffset,
      networkIdentifier,
    ).then((transaction) => {
      dispatch({
        type: actionTypes.addNewPendingTransaction,
        data: txAdapter({
          ...transaction,
          senderId: extractAddress(transaction.senderPublicKey),
        }),
      });
      callback({
        success: true,
        transaction,
      });
    }).catch((error) => {
      callback({
        success: false,
        error,
        message: (error && error.message) ? error.message : i18next.t('An error occurred while registering your second passphrase. Please try again.'),
      });
    });
    dispatch(passphraseUsed(passphrase));
  };

/**
 * This action is used to update account balance when new block was forged and
 * account middleware detected that it contains a transaction that affects balance
 * of the active account
 *
 * @param {Object} data
 * @param {Object} data.account - current account with address and publicKey
 * @param {Array} data.transactions - list of transactions
 */
export const accountDataUpdated = ({ account }) =>
  async (dispatch, getState) => {
    const networkConfig = getState().network;
    const [error, result] = await to(getAccount({
      networkConfig,
      address: account.address,
      publicKey: account.publicKey,
    }));
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
    const account = await getAccount({ ...options, token });
    return {
      ...accounts,
      [token]: account,
    };
  }, Promise.resolve({}));
}

export const updateEnabledTokenAccount = token => async (dispatch, getState) => {
  const { network: networkConfig, account } = getState();
  if (token !== tokenMap.LSK.key) {
    const [error, result] = await to(getAccount({
      token,
      networkConfig,
      passphrase: account.passphrase,
    }));
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
  const { network: networkConfig, settings } = getState();
  dispatch(accountLoading());
  const expireTime = (passphrase && settings.autoLog)
    ? Date.now() + accountConfig.lockDuration
    : 0;

  const activeTokens = Object.keys(settings.token.list)
    .filter(key => settings.token.list[key]);
  const [error, info] = await to(getAccounts(activeTokens, {
    networkConfig, publicKey, passphrase,
  }));

  if (error) {
    toast.error(getConnectionErrorMessage(error));
    dispatch(accountLoggedOut());
  } else {
    dispatch(accountLoggedIn({
      passphrase,
      loginType: hwInfo ? loginType[hwInfo.deviceModel.replace(/\s.+$/, '').toLowerCase()] : loginType.normal,
      hwInfo: hwInfo || {},
      expireTime,
      info,
    }));
  }
};
