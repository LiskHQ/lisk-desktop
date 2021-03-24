import to from 'await-to-js';

import {
  actionTypes, tokenMap, MODULE_ASSETS, loginTypes,
} from '@constants';
import { extractAddress } from '@utils/account';
import { getTransactions, create, broadcast } from '@utils/api/transaction';
import { signSendTransaction } from '@utils/hwManager';
import { passphraseUsed } from './account';
import { loadingStarted, loadingFinished } from './loading';

/**
 * Action trigger when user logout from the application
 * the transactions reducer is set to initial state
 */
export const emptyTransactionsData = () => ({ type: actionTypes.emptyTransactionsData });

/**
 * Action trigger after a new transaction is broadcasted to the network
 * then the transaction is add to the pending transaction array in transaction reducer
 * Used in:  Send, Vote, Second passphrase registration, and delegate registration.
 * @param {Object} params - all params
 * @param {String} params.senderPublicKey - alphanumeric string
 */
export const addNewPendingTransaction = data => ({
  type: actionTypes.addNewPendingTransaction,
  data: {
    ...data,
    senderId: extractAddress(data.senderPublicKey),
  },
});

/**
 * Action trigger for retrieving any amount of transactions
 * for Dashboard and Wallet components
 *
 * @param {Object} params - Object with all params.
 * @param {String} params.address - address of the account to fetch the transactions for
 * @param {Number} params.limit - amount of transactions to fetch
 * @param {Number} params.offset - index of the first transaction
 * @param {Object} params.filters - object with filters for the filer dropdown
 *   (e.g. minAmount, maxAmount, message, minDate, maxDate)
 */
export const transactionsRetrieved = ({
  address,
  limit = 30,
  offset = 0,
  filters = {},
}) => async (dispatch, getState) => {
  dispatch(loadingStarted(actionTypes.transactionsRetrieved));
  const { network, settings } = getState();
  const token = settings.token.active;

  getTransactions({
    network,
    params: {
      address,
      ...filters,
      limit,
      offset,
    },
  }, token)
    .then((response) => {
      dispatch({
        type: actionTypes.transactionsRetrieved,
        data: {
          offset,
          address,
          confirmed: response.data,
          count: response.meta.total,
          filters,
        },
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.transactionLoadFailed,
        data: {
          error,
        },
      });
    })
    .finally(() => {
      dispatch(loadingFinished(actionTypes.transactionsRetrieved));
    });
};

// TODO remove this function once create and broadcast HOC be implemented
export const resetTransactionResult = () => ({
  type: actionTypes.resetTransactionResult,
});

/**
 * Calls transactionAPI.create for create the tx object that will broadcast
 * @param {Object} data
 * @param {String} data.recipientAddress
 * @param {Number} data.amount - In raw format (satoshis, beddows)
 * @param {Number} data.fee - In raw format, used for updating the TX List.
 * @param {Number} data.dynamicFeePerByte - In raw format, used for creating BTC transaction.
 * @param {Number} data.reference - Data field for LSK transactions
 */
export const transactionCreated = data => async (dispatch, getState) => {
  const {
    account, settings, network,
  } = getState();
  const activeToken = settings.token.active;

  const [error, tx] = account.loginType === loginTypes.passphrase.code
    ? await to(create(
      { ...data, network, moduleAssetType: MODULE_ASSETS.transfer },
      activeToken,
    ))
    : await to(signSendTransaction(account, data));
  if (error || (account.loginType !== loginTypes.passphrase.code && !tx.signatures)) {
    return dispatch({
      type: actionTypes.transactionCreatedError,
      data: error,
    });
  }

  return dispatch({
    type: actionTypes.transactionCreatedSuccess,
    data: tx,
  });
};

/**
 * Calls transactionAPI.broadcast function for put the tx object (signed) into the network
 * @param {Object} transaction
 * @param {String} transaction.recipientAddress
 * @param {Number} transaction.amount - In raw format (satoshis, beddows)
 * @param {Number} transaction.fee - In raw format, used for updating the TX List.
 * @param {Number} transaction.dynamicFeePerByte - In raw format, used for creating BTC transaction.
 * @param {Number} transaction.reference - Data field for LSK transactions
 */
export const transactionBroadcasted = (transaction, callback = () => {}) =>
  // eslint-disable-next-line max-statements
  async (dispatch, getState) => {
    const { network, settings } = getState();
    const activeToken = settings.token.active;

    const [error] = await to(broadcast(
      {
        transaction,
        network: {
          address: network.networks[activeToken].nodeUrl,
          name: network.name,
        },
      },
      activeToken,
    ));

    callback({ success: !error, error, transaction });
    if (error) {
      return dispatch({
        type: actionTypes.broadcastedTransactionError,
        data: {
          error,
          transaction,
        },
      });
    }

    dispatch({
      type: actionTypes.broadcastedTransactionSuccess,
      data: transaction,
    });

    if (activeToken !== tokenMap.BTC.key) {
      dispatch(addNewPendingTransaction({
        ...transaction,
        title: MODULE_ASSETS.getByCode(transaction.type).key,
        amount: transaction.asset.amount,
        recipientId: transaction.asset.recipientId,
      }));
    }

    return dispatch(passphraseUsed(new Date()));
  };
