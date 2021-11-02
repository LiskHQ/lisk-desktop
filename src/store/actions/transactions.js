import to from 'await-to-js';

import {
  actionTypes, tokenMap, MODULE_ASSETS_NAME_ID_MAP, loginTypes, DEFAULT_LIMIT,
} from '@constants';
import { getTransactions, create, broadcast } from '@api/transaction';
import { transformTransaction } from '@utils/transaction';
import { signTransactionByHW } from '@utils/hwManager';
import { timerReset } from './account';
import { loadingStarted, loadingFinished } from './loading';

/**
 * Action trigger when user logout from the application
 * the transactions reducer is set to initial state
 */
export const emptyTransactionsData = () => ({ type: actionTypes.emptyTransactionsData });

/**
 * Action trigger after a new transaction is broadcasted to the network
 * then the transaction is add to the pending transaction array in transaction reducer
 * Used in:  Send, Vote, and delegate registration.
 * @param {Object} params - all params
 * @param {String} params.senderPublicKey - alphanumeric string
 */
export const pendingTransactionAdded = data => ({
  type: actionTypes.pendingTransactionAdded,
  data,
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
  limit = DEFAULT_LIMIT,
  offset = 0,
  filters = {},
}) => async (dispatch, getState) => {
  dispatch(loadingStarted(actionTypes.transactionsRetrieved));

  const { network, settings } = getState();
  const token = settings.token.active;

  const params = {
    address,
    ...filters,
    limit,
    offset,
  };

  try {
    const { data, meta } = await getTransactions({ network, params }, token);
    dispatch({
      type: actionTypes.transactionsRetrieved,
      data: {
        offset,
        address,
        filters,
        confirmed: data,
        count: meta.total,
      },
    });
  } catch (error) {
    dispatch({
      type: actionTypes.transactionLoadFailed,
      data: { error },
    });
  } finally {
    dispatch(loadingFinished(actionTypes.transactionsRetrieved));
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
 * @param {Number} data.amount - In raw format (satoshi, beddows)
 * @param {Number} data.fee - In raw format, used for updating the TX List.
 * @param {Number} data.dynamicFeePerByte - In raw format, used for creating BTC transaction.
 * @param {Number} data.reference - Data field for LSK transactions
 */
// eslint-disable-next-line max-statements
export const transactionCreated = data => async (dispatch, getState) => {
  const {
    account, settings, network,
  } = getState();
  const activeToken = settings.token.active;

  const params = {
    transactionObject: {
      ...data,
      moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.transfer,
    },
    account: account.info[activeToken],
    passphrase: account.passphrase,
    network,
    isHwSigning: account.loginType !== loginTypes.passphrase.code,
  };

  let [error, tx] = await to(create(params, activeToken));

  if (error) {
    dispatch({
      type: actionTypes.transactionSignError,
      data: error,
    });
  }

  if (params.isHwSigning) {
    // tx contain txObject and txBytes that needs to be signed by HW
    [error, tx] = await to(signTransactionByHW(
      account,
      tx.networkIdentifier,
      tx.transactionObject,
      tx.transactionBytes,
    ));
  }

  if (error) {
    dispatch({
      type: actionTypes.transactionSignError,
      data: error,
    });
  }
  dispatch({
    type: actionTypes.transactionCreatedSuccess,
    data: tx,
  });
};

export const transactionDoubleSigned = data => ({
  type: actionTypes.transactionDoubleSigned,
  data,
});

/**
 * Calls transactionAPI.broadcast function for put the tx object (signed) into the network
 * @param {Object} transaction
 * @param {String} transaction.recipientAddress
 * @param {Number} transaction.amount - In raw format (satoshi, beddows)
 * @param {Number} transaction.fee - In raw format, used for updating the TX List.
 * @param {Number} transaction.dynamicFeePerByte - In raw format, used for creating BTC transaction.
 * @param {Number} transaction.reference - Data field for LSK transactions
 */
export const transactionBroadcasted = transaction =>
  // eslint-disable-next-line max-statements
  async (dispatch, getState) => {
    const { network, settings, account } = getState();
    const activeToken = settings.token.active;
    const serviceUrl = network.networks[activeToken].serviceUrl;

    const [error] = await to(broadcast(
      { transaction, serviceUrl },
      activeToken,
    ));

    if (error) {
      dispatch({
        type: actionTypes.broadcastedTransactionError,
        data: {
          error,
          transaction,
        },
      });
    } else {
      dispatch({
        type: actionTypes.broadcastedTransactionSuccess,
        data: transaction,
      });

      if (activeToken === tokenMap.LSK.key) {
        const transformedTransaction = transformTransaction(transaction);
        if (transformedTransaction.sender.address === account.info.LSK.summary.address) {
          dispatch(pendingTransactionAdded({ ...transformedTransaction, isPending: true }));
        }
      }

      dispatch(timerReset());
    }
  };
