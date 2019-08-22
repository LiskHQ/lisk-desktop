import { to } from 'await-to-js';
import i18next from 'i18next';
import { errorToastDisplayed } from './toaster';
import { extractAddress } from '../utils/account';
import { getAPIClient } from '../utils/api/network';
import { getAccount, setSecondPassphrase } from '../utils/api/account';
import { getConnectionErrorMessage } from './network/lsk';
import { getTimeOffset } from '../utils/hacks';
import { loginType } from '../constants/hwConstants';
import { networkStatusUpdated } from './network';
import { updateTransactions } from './transactions';
import accountConfig from '../constants/account';
import actionTypes from '../constants/actions';

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
    const { settings: { token: { active } } } = getState();
    const liskAPIClient = getAPIClient(active, getState());
    const timeOffset = getTimeOffset(getState());
    setSecondPassphrase(liskAPIClient, secondPassphrase, account.publicKey, passphrase, timeOffset)
      .then((transaction) => {
        dispatch({
          type: actionTypes.addNewPendingTransaction,
          data: {
            ...transaction,
            senderId: extractAddress(transaction.senderPublicKey),
          },
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

export const updateTransactionsIfNeeded = ({ transactions, account }) =>
  (dispatch) => {
    const hasRecentTransactions = txs => (
      txs.confirmed.filter(tx => tx.confirmations < 1000).length !== 0
      || txs.pending.length !== 0
    );

    if (hasRecentTransactions(transactions)) {
      const { filters } = transactions;
      const address = transactions.account ? transactions.account.address : account.address;

      dispatch(updateTransactions({
        pendingTransactions: transactions.pending,
        address,
        filters,
      }));
    }
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
export const accountDataUpdated = ({
  account, transactions,
}) =>
  async (dispatch, getState) => {
    const networkConfig = getState().network;
    const [error, result] = await to(getAccount({
      networkConfig,
      address: account.address,
      publicKey: account.publicKey,
    }));
    if (result) {
      if (result.balance !== account.balance) {
        dispatch(updateTransactionsIfNeeded({
          transactions,
          account,
        }));
      }
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

export const updateEnabledTokensAccounts = token => async (dispatch, getState) => {
  const { network: networkConfig, account } = getState();
  const [error, result] = await to(getAccount({
    token,
    networkConfig,
    passphrase: account.passphrase,
  }));
  if (error) {
    dispatch(errorToastDisplayed({ label: getConnectionErrorMessage(error) }));
  } else {
    dispatch(accountUpdated(result));
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
    dispatch(errorToastDisplayed({ label: getConnectionErrorMessage(error) }));
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
