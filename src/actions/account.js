import i18next from 'i18next';
import actionTypes from '../constants/actions';
import { extractAddress } from '../utils/account';
import { getAccount, setSecondPassphrase } from '../utils/api/account';
import { getDelegates } from '../utils/api/delegates';
import { getTransactions } from '../utils/api/transactions';
import { getBlocks } from '../utils/api/blocks';
import { updateTransactions } from './transactions';
import { networkStatusUpdated } from './network';
import { getAPIClient } from '../utils/api/network';
import { getTimeOffset } from '../utils/hacks';
import transactionTypes from '../constants/transactionTypes';
import accountConfig from '../constants/account';
import { loginType } from '../constants/hwConstants';
import { errorToastDisplayed } from './toaster';
import { tokenMap } from '../constants/tokens';
import { getConnectionErrorMessage } from './network/lsk';

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

/**
 *
 */
export const secondPassphraseRegistered = ({
  secondPassphrase, account, passphrase, callback,
}) =>
  (dispatch, getState) => {
    const { settings: { token: { active } } } = getState();
    const liskAPIClient = getAPIClient(active, getState());
    const timeOffset = getTimeOffset(getState());
    setSecondPassphrase(liskAPIClient, secondPassphrase, account.publicKey, passphrase, timeOffset)
      .then((transaction) => {
        dispatch({
          data: {
            ...transaction,
            senderId: extractAddress(transaction.senderPublicKey),
          },
          type: actionTypes.addPendingTransaction,
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

export const updateDelegateAccount = ({ publicKey }) =>
  (dispatch, getState) => {
    const { account, settings: { token: { active } } } = getState();
    const liskAPIClient = getAPIClient(active, getState());
    return getDelegates(liskAPIClient, { publicKey })
      .then((response) => {
        dispatch(accountUpdated({
          delegate: {
            ...(account.delegate || {}),
            ...response.data[0],
          },
          isDelegate: true,
        }));
      });
  };


// TODO change all uses of loadDelegate to updateDelegateAccount
export const loadDelegate = updateDelegateAccount;

export const updateTransactionsIfNeeded = ({ transactions, account }, windowFocus) =>
  (dispatch) => {
    const hasRecentTransactions = txs => (
      txs.confirmed.filter(tx => tx.confirmations < 1000).length !== 0
      || txs.pending.length !== 0
    );

    if (windowFocus || hasRecentTransactions(transactions)) {
      const { filters } = transactions;
      const address = transactions.account ? transactions.account.address : account.address;

      dispatch(updateTransactions({
        pendingTransactions: transactions.pending,
        address,
        filters,
      }));
    }
  };

export const accountDataUpdated = ({
  account, windowIsFocused, transactions,
}) =>
  (dispatch, getState) => {
    const networkConfig = getState().network;
    getAccount({
      networkConfig,
      address: account.address,
      publicKey: account.publicKey,
    })
      .then((result) => {
        if (result.balance !== account.balance) {
          dispatch(updateTransactionsIfNeeded(
            {
              transactions,
              account,
            },
            !windowIsFocused,
          ));
        }
        dispatch(accountUpdated(result));
        dispatch(networkStatusUpdated({ online: true }));
      }).catch((res) => {
        dispatch(networkStatusUpdated({ online: false, code: res.error.code }));
      });
  };

export const updateAccountDelegateStats = account =>
  async (dispatch, getState) => {
    const { settings: { token: { active } } } = getState();
    const liskAPIClient = getAPIClient(active, getState());
    const { address, publicKey } = account;
    const networkConfig = getState().network;
    const token = tokenMap.LSK.key;
    const transaction = await getTransactions({
      token, networkConfig, address, limit: 1, type: transactionTypes.registerDelegate,
    });
    const block = await getBlocks(liskAPIClient, { generatorPublicKey: publicKey, limit: 1 });
    dispatch(accountUpdated({
      token,
      delegate: {
        ...(getState().account.info.LSK.delegate || {}),
        lastBlock: (block.data[0] && block.data[0].timestamp) || '-',
        txDelegateRegister: transaction.data[0],
      },
    }));
  };

// eslint-disable-next-line max-statements
export const login = ({ passphrase, publicKey, hwInfo }) => async (dispatch, getState) => {
  const { network: networkConfig, settings } = getState();
  dispatch(accountLoading());
  try {
    const lskAccount = await getAccount({
      token: tokenMap.LSK.key, networkConfig, publicKey, passphrase,
    });

    const expireTime = (passphrase && settings.autoLog)
      ? Date.now() + accountConfig.lockDuration
      : 0;

    if (lskAccount) {
      const btcAccount = settings.token.list.BTC
        && await getAccount({ token: tokenMap.BTC.key, networkConfig, passphrase });
      dispatch(accountLoggedIn({
        passphrase,
        loginType: hwInfo ? loginType[hwInfo.deviceModel.replace(/\s.+$/, '').toLowerCase()] : loginType.normal,
        hwInfo: hwInfo || {},
        expireTime,
        info: {
          LSK: lskAccount,
          ...(btcAccount ? { BTC: btcAccount } : {}),
        },
      }));
    }
  } catch (error) {
    dispatch(errorToastDisplayed({ label: getConnectionErrorMessage(error) }));
    dispatch(accountLoggedOut());
  }
};
