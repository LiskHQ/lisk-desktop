/* eslint-disable max-lines */
import i18next from 'i18next';
import to from 'await-to-js';
import actionTypes from '../constants/actions';
import Fees from '../constants/fees';
import { tokenMap } from '../constants/tokens';
import transactionTypes from '../constants/transactionTypes';
import { loadingStarted, loadingFinished } from './loading';
import { extractAddress } from '../utils/account';
import { passphraseUsed } from './account';
import { getTimeOffset } from '../utils/hacks';
import { loginType } from '../constants/hwConstants';
import { transactions as transactionsAPI } from '../utils/api';
import { signSendTransaction } from '../utils/hwManager';
import { txAdapter } from '../utils/api/lsk/adapters';

// ========================================= //
//            ACTION CREATORS
// ========================================= //

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
  data: txAdapter({
    ...data,
    senderId: extractAddress(data.senderPublicKey),
  }),
});

// ========================================= //
//                THUNKS
// ========================================= //

/**
 * Action trigger for retrieving any amount of transactions
 * for Dashboard and Wallet components
 * @param {Object} params - Object with all params.
 * @param {String} params.address - address of the account to fetch the transactions for
 * @param {Number} params.limit - amount of transactions to fetch
 * @param {Number} params.offset - index of the first transaction
 * @param {Object} params.filters - object with filters for the filer dropdown
 *   (e.g. minAmount, maxAmount, message, minDate, maxDate)
 * @param {Number} params.filters.direction - one of values from src/constants/transactionFilters.js
 */
export const getTransactions = ({
  address,
  limit = undefined,
  offset = 0,
  filters = undefined,
}) => async (dispatch, getState) => {
  dispatch(loadingStarted(actionTypes.getTransactions));
  const networkConfig = getState().network;

  if (networkConfig) {
    const [error, response] = await to(transactionsAPI.getTransactions({
      networkConfig, address, filters, limit, offset,
    }));

    if (error) {
      dispatch({
        type: actionTypes.transactionLoadFailed,
        data: {
          error,
        },
      });
    } else {
      dispatch({
        type: offset > 0 ? actionTypes.updateTransactions : actionTypes.getTransactionsSuccess,
        data: {
          address,
          confirmed: response.data,
          count: parseInt(response.meta.count, 10),
          filters,
        },
      });
    }
  }

  dispatch(loadingFinished(actionTypes.getTransactions));
};

/**
 * This action is used to update transactions from account middleware when balance
 * of the account changes. The difference from getTransactions action is that
 * this one merges the transactions list with what is already in the store whereas
 * the other one replaces the list.
 *
 * @param {Object} params - all params
 * @param {String} params.address - address of the account to fetch the transactions for
 * @param {Number} params.limit - amount of transactions to fetch
 * @param {Object} params.filters - object with filters for the filer dropdown
 *   (e.g. minAmount, maxAmount, message, minDate, maxDate)
 * @param {Number} params.filters.direction - one of values from src/constants/transactionFilters.js
 */
export const updateTransactions = ({
  address,
  filters,
  limit,
}) => async (dispatch, getState) => {
  const { network, transactions } = getState();

  if (network) {
    const [error, response] = await to(transactionsAPI.getTransactions({
      networkConfig: network, address, limit, filters,
    }));

    if (error) {
      dispatch({
        type: actionTypes.transactionLoadFailed,
        data: {
          error,
        },
      });
    } else if (response && filters.direction === transactions.filters.direction) {
      dispatch({
        type: actionTypes.updateTransactions,
        data: {
          confirmed: response.data,
          count: parseInt(response.meta.count, 10),
        },
      });
    }
  }
};

// ================================================ //
//  TODO
// The following functions needs to be remove after
// implement and use send and broadcast HOC
// ================================================ //

// TODO remove this function after remove sent function
const handleSentError = ({
  account, dispatch, error, tx,
}) => {
  let text;
  switch (account.loginType) {
    case loginType.normal:
      text = error && error.message ? `${error.message}.` : i18next.t('An error occurred while creating the transaction.');
      break;
    case loginType.ledger:
    case loginType.trezor:
      text = i18next.t('You have cancelled the transaction on your hardware wallet. You can either continue or retry.');
      break;
    default:
      text = error.message;
  }

  dispatch({
    type: actionTypes.transactionFailed,
    data: {
      errorMessage: text,
      tx,
    },
  });
};


/**
 * Calls transactionAPI.create and transactionAPI.broadcast methods to make a transaction.
 * @param {Object} data
 * @param {String} data.recipientAddress
 * @param {Number} data.amount - In raw format (satoshis, beddows)
 * @param {Number} data.fee - In raw format, used for updating the TX List.
 * @param {Number} data.dynamicFeePerByte - In raw format, used for creating BTC transaction.
 * @param {Number} data.reference - Data field for LSK transactions
 * @param {String} data.secondPassphrase - Second passphrase for LSK transactions
 */
// TODO remove this function once create and broadcast HOC be implemented
// eslint-disable-next-line max-statements
export const sent = data => async (dispatch, getState) => {
  let tx;
  let fail;
  const {
    account, network, settings, blocks,
  } = getState();
  const timeOffset = getTimeOffset(blocks.latestBlocks);
  const activeToken = settings.token.active;
  const senderId = account.info[activeToken].address;

  const txData = { ...data, timeOffset };

  try {
    if (account.loginType === loginType.normal) {
      tx = await transactionsAPI.create(activeToken, txData, transactionTypes().send.key);
    } else {
      [fail, tx] = await (signSendTransaction(account, data));

      if (fail) throw new Error(fail);
    }
    const broadcastTx = await transactionsAPI.broadcast(activeToken, tx, network);

    loadingFinished('sent');
    dispatch(addNewPendingTransaction({
      amount: txData.amount,
      asset: { reference: txData.data },
      fee: Fees.send,
      id: broadcastTx.id,
      recipientId: txData.recipientId,
      senderId,
      senderPublicKey: account.publicKey,
      type: transactionTypes().send.code,
    }));

    dispatch(passphraseUsed(txData.passphrase));
  } catch (error) {
    loadingFinished('sent');
    handleSentError({
      error, account, tx, dispatch,
    });
  }
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
 * @param {String} data.secondPassphrase - Second passphrase for LSK transactions
 */
// TODO remove this function once create and broadcast HOC be implemented
export const transactionCreated = data => async (dispatch, getState) => {
  const {
    account, settings, network, ...state
  } = getState();
  const timeOffset = getTimeOffset(state.blocks.latestBlocks);
  const activeToken = settings.token.active;

  const [error, tx] = account.loginType === loginType.normal
    ? await to(transactionsAPI.create(
      activeToken,
      { ...data, timeOffset, network },
      transactionTypes().send.key,
    ))
    : await to(signSendTransaction(account, { ...data, timeOffset }));

  if (error) {
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
 * @param {String} transaction.secondPassphrase - Second passphrase for LSK transactions
 */
// TODO remove this function once create and broadcast HOC be implemented
export const transactionBroadcasted = (transaction, callback = () => {}) =>
  async (dispatch, getState) => {
    const { network, settings } = getState();
    const activeToken = settings.token.active;

    const [error] = await to(transactionsAPI.broadcast(activeToken, transaction, network));

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
      dispatch(addNewPendingTransaction(transaction));
    }

    return dispatch(passphraseUsed(transaction.passphrase));
  };
