import i18next from 'i18next';
import actionTypes from '../constants/actions';
import { getAccount, setSecondPassphrase } from '../utils/api/account';
import { registerDelegate, getDelegates } from '../utils/api/delegates';
import { getTransactions } from '../utils/api/transactions';
import { getBlocks } from '../utils/api/blocks';
import { updateTransactions } from './transactions';
import { delegateRegisteredFailure } from './delegate';
import { liskAPIClientUpdate } from './peers';
import { getTimeOffset } from '../utils/hacks';
import Fees from '../constants/fees';
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
    const liskAPIClient = getState().peers.liskAPIClient;
    const timeOffset = getTimeOffset(getState());
    setSecondPassphrase(liskAPIClient, secondPassphrase, account.publicKey, passphrase, timeOffset)
      .then((transaction) => {
        dispatch({
          data: transaction,
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
    const liskAPIClient = getState().peers.liskAPIClient;
    return getDelegates(liskAPIClient, { publicKey })
      .then((response) => {
        dispatch(accountUpdated({
          token: 'LSK',
          delegate: {
            ...(getState().account.info.LSK.delegate || {}),
            ...response.data[0],
          },
          isDelegate: true,
        }));
      });
  };


// TODO change all uses of loadDelegate to updateDelegateAccount
export const loadDelegate = updateDelegateAccount;


/**
 *
 */
export const delegateRegistered = ({
  account, passphrase, username, secondPassphrase,
}) =>
  (dispatch, getState) => {
    const timeOffset = getTimeOffset(getState());
    const liskAPIClient = getState().peers.liskAPIClient;
    registerDelegate(liskAPIClient, username, passphrase, secondPassphrase, timeOffset)
      .then((data) => {
        // dispatch to add to pending transaction
        dispatch({
          data: {
            id: data.id,
            senderPublicKey: account.publicKey,
            senderId: account.address,
            username,
            amount: 0,
            fee: Fees.registerDelegate,
            type: transactionTypes.registerDelegate,
            token: 'LSK',
          },
          type: actionTypes.addPendingTransaction,
        });
      })
      .catch((error) => {
        dispatch(delegateRegisteredFailure(error));
      });
    dispatch(passphraseUsed(passphrase));
  };

export const updateTransactionsIfNeeded = ({ transactions, account }, windowFocus) =>
  (dispatch) => {
    const hasRecentTransactions = txs => (
      txs.confirmed.filter(tx => tx.confirmations < 1000).length !== 0 ||
      txs.pending.length !== 0
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
        dispatch(liskAPIClientUpdate({ online: true }));
      }).catch((res) => {
        dispatch(liskAPIClientUpdate({ online: false, code: res.error.code }));
      });
  };

export const updateAccountDelegateStats = account =>
  async (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
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

export const login = ({ passphrase, publicKey, hwInfo }) => async (dispatch, getState) => {
  const networkConfig = getState().network;
  dispatch(accountLoading());

  await getAccount({
    token: tokenMap.LSK.key, networkConfig, publicKey, passphrase,
  }).then(async (accountData) => {
    const expireTime = (passphrase && getState().settings.autoLog) ?
      Date.now() + accountConfig.lockDuration : 0;
    dispatch(accountLoggedIn({
      ...accountData, // TODO remove this after all components are updated to use "info"
      passphrase,
      loginType: hwInfo ? loginType.ledger : loginType.normal,
      hwInfo: hwInfo || {},
      expireTime,
      info: {
        LSK: accountData,
      },
    }));
    await getAccount({
      token: tokenMap.BTC.key, networkConfig, passphrase,
    }).then((btcAccountData) => {
      dispatch(accountUpdated(btcAccountData));
    });
  }).catch((error) => {
    dispatch(errorToastDisplayed({
      label: getConnectionErrorMessage(error),
    }));
    dispatch(accountLoggedOut());
  });
};
