/* eslint-disable max-lines */
import i18next from 'i18next';
import to from 'await-to-js';
import actionTypes from '../constants/actions';
import { loadingStarted, loadingFinished } from '../actions/loading';
import { getDelegates } from '../utils/api/delegates';
import { loadDelegateCache } from '../utils/delegates';
import { extractAddress } from '../utils/account';
import { passphraseUsed } from './account';
import { getTimeOffset } from '../utils/hacks';
import Fees from '../constants/fees';
import transactionTypes from '../constants/transactionTypes';
import { sendWithHW } from '../utils/api/hwWallet';
import { loginType } from '../constants/hwConstants';
import { transactions as transactionsAPI, hardwareWallet as hwAPI } from '../utils/api';
import { tokenMap } from '../constants/tokens';

/**
 * This action is used on logout
 *
 */
export const cleanTransactions = () => ({
  type: actionTypes.cleanTransactions,
});

/**
 * This action is used when a new pending transaction is sent to the network.
 * It is used in send, vote, second passphrase registration, and delegate registration.
 *
 * @param {Object} data - the transaction object
 */
export const addPendingTransaction = data => ({
  data,
  type: actionTypes.addPendingTransaction,
});

/**
 * This action is used to request transactions on dashboard and wallet page.
 *
 * @param {Object} params - all params
 * @param {String} params.address - address of the account to fetch the transactions for
 * @param {Number} params.limit - amount of transactions to fetch
 * @param {Number} params.offset - index of the first transaction
 * @param {Object} params.filters - object with filters for the filer dropdown
 *   (e.g. minAmount, maxAmount, message, minDate, maxDate)
 * @param {Number} params.filters.direction - one of values from src/constants/transactionFilters.js
 */
export const loadTransactions = ({
  address, limit, offset, filters,
}) =>
  (dispatch, getState) => {
    dispatch(loadingStarted(actionTypes.loadTransactions));
    const networkConfig = getState().network;
    transactionsAPI.getTransactions({
      networkConfig, address, limit, offset, filters,
    })
      .then((response) => {
        dispatch({
          data: {
            count: parseInt(response.meta.count, 10),
            confirmed: response.data,
            address,
            filters,
          },
          type: offset > 0 ? actionTypes.updateTransactions : actionTypes.transactionsLoaded,
        });
        if (filters && filters.direction !== undefined) {
          dispatch({
            data: {
              filterName: 'wallet',
              value: filters.direction,
            },
            type: actionTypes.addFilter,
          });
        }
        dispatch(loadingFinished(actionTypes.loadTransactions));
      });
  };

/**
 * This action is used to get the data for "My Wallet Details" module on wallet page
 * which shows Last transactions. It cannot get the latest transaction from the list,
 * because the list can be filtered.
 *
 * @param {String} address - address of the active account
 */
export const loadLastTransaction = address => (dispatch, getState) => {
  const networkConfig = getState().network;
  if (networkConfig) {
    dispatch({ type: actionTypes.transactionCleared });
    transactionsAPI.getTransactions({
      networkConfig, address, limit: 1, offset: 0,
    }).then(response => dispatch({ data: response.data[0], type: actionTypes.transactionLoaded }));
  }
};

/**
 * This action is used to get the data for transaction detail page.
 *
 * @param {String} id - id of the transaction
 */
export const loadSingleTransaction = ({ id }) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    const networkConfig = getState().network;
    dispatch({ type: actionTypes.transactionCleared });
    // TODO remove the btc condition
    transactionsAPI.getSingleTransaction(localStorage.getItem('btc') ? { networkConfig, id } : { liskAPIClient, id })
      .then((response) => { // eslint-disable-line max-statements
        let added = [];
        let deleted = [];

        if (!response.data.length) {
          dispatch({ data: { error: i18next.t('Transaction not found') }, type: actionTypes.transactionLoadFailed });
          return;
        }

        // since core 1.0 added and deleted are not filtered in core,
        // but provided as single array with [+,-] signs
        if (response.data[0].asset && 'votes' in response.data[0].asset) {
          added = response.data[0].asset.votes.filter(item => item.startsWith('+')).map(item => item.replace('+', ''));
          deleted = response.data[0].asset.votes.filter(item => item.startsWith('-')).map(item => item.replace('-', ''));
        }

        const localStorageDelegates = loadDelegateCache(getState().peers);
        deleted.forEach((publicKey) => {
          const address = extractAddress(publicKey);
          const storedDelegate = localStorageDelegates[address];
          if (storedDelegate) {
            dispatch({
              data: {
                delegate: {
                  username: storedDelegate.username,
                  address,
                },
                voteArrayName: 'deleted',
              },
              type: actionTypes.transactionAddDelegateName,
            });
          } else {
            getDelegates(liskAPIClient, { publicKey })
              .then((delegateData) => {
                dispatch({
                  data: { delegate: delegateData.data[0], voteArrayName: 'deleted' },
                  type: actionTypes.transactionAddDelegateName,
                });
              });
          }
        });

        added.forEach((publicKey) => {
          const address = extractAddress(publicKey);
          if (localStorageDelegates[address]) {
            dispatch({
              data: { delegate: { ...localStorageDelegates[address], address }, voteArrayName: 'added' },
              type: actionTypes.transactionAddDelegateName,
            });
          } else {
            getDelegates(liskAPIClient, { publicKey })
              .then((delegateData) => {
                dispatch({
                  data: { delegate: delegateData.data[0], voteArrayName: 'added' },
                  type: actionTypes.transactionAddDelegateName,
                });
              });
          }
        });
        dispatch({ data: response.data[0], type: actionTypes.transactionLoaded });
      }).catch((error) => {
        dispatch({ data: { error }, type: actionTypes.transactionLoadFailed });
      });
  };

/**
 * This action is used to update transactions from account middleware when balance
 * of the account changes. The difference from loadTransactions action is that
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
  address, limit, filters,
}) =>
  (dispatch, getState) => {
    const networkConfig = getState().network;

    transactionsAPI.getTransactions({
      networkConfig, address, limit, filters,
    })
      .then((response) => {
        if (filters && filters.direction === getState().transactions.filters.direction) {
          dispatch({
            data: {
              confirmed: response.data,
              count: parseInt(response.meta.count, 10),
            },
            type: actionTypes.updateTransactions,
          });
        }
      });
  };

const handleSentError = ({
  account, dispatch, error, tx,
}) => {
  let text;
  switch (account.loginType) {
    case loginType.normal:
      text = error && error.message ? `${error.message}.` : i18next.t('An error occurred while creating the transaction.');
      break;
    case loginType.ledger:
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
// eslint-disable-next-line max-statements
export const sent = data => async (dispatch, getState) => {
  let broadcastTx;
  let tx;
  let fail;
  const { account, network, settings } = getState();
  const timeOffset = getTimeOffset(getState());
  const activeToken = localStorage.getItem('btc') // TODO: Refactor after enabling BTC
    ? settings.token.active
    : tokenMap.LSK.key;
  const senderId = localStorage.getItem('btc') // TODO: Refactor after enabling BTC
    ? account.info[activeToken].address
    : account.address;

  const txData = { ...data, timeOffset };

  try {
    if (account.loginType === loginType.normal) {
      tx = await transactionsAPI.create(activeToken, txData);
      broadcastTx = await transactionsAPI.broadcast(activeToken, tx, network);
    } else {
      [fail, broadcastTx] = await to(sendWithHW(
        network,
        account,
        data.recipientId,
        data.amount,
        data.secondPassphrase,
        data.data,
      ));

      if (fail) throw new Error(fail);
    }

    loadingFinished('sent');
    dispatch(addPendingTransaction({
      amount: txData.amount,
      asset: { reference: txData.data },
      fee: Fees.send,
      id: broadcastTx.id,
      recipientId: txData.recipientId,
      senderId,
      senderPublicKey: account.publicKey,
      type: transactionTypes.send,
    }));

    dispatch(passphraseUsed(txData.passphrase));
  } catch (error) {
    loadingFinished('sent');
    handleSentError({
      error, account, tx, dispatch,
    });
  }
};


export const transactionCreatedSuccess = data => ({
  type: actionTypes.transactionCreatedSuccess,
  data,
});

export const transactionCreatedError = data => ({
  type: actionTypes.transactionCreatedError,
  data,
});

export const resetTransactionResult = () => ({
  type: actionTypes.resetTransactionResult,
});

export const broadcastedTransactionError = data => ({
  type: actionTypes.broadcastedTransactionError,
  data,
});

export const broadcastedTransactionSuccess = data => ({
  type: actionTypes.broadcastedTransactionSuccess,
  data,
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
// eslint-disable-next-line max-statements
export const transactionCreated = data => async (dispatch, getState) => {
  const { account, settings, ...state } = getState();
  const timeOffset = getTimeOffset(state);
  const activeToken = localStorage.getItem('btc') // TODO: Refactor after enabling BTC
    ? settings.token.active
    : tokenMap.LSK.key;

  const [error, tx] = account.loginType === loginType.normal
    ? await to(transactionsAPI.create(activeToken, { ...data, timeOffset }))
    : await to(hwAPI.create(account, data));

  if (error) return dispatch(transactionCreatedError(error));
  return dispatch(transactionCreatedSuccess(tx));
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
export const transactionBroadcasted = transaction => async (dispatch, getState) => {
  const { account, network, settings } = getState();
  const activeToken = localStorage.getItem('btc') // TODO: Refactor after enabling BTC
    ? settings.token.active
    : tokenMap.LSK.key;

  const [error, tx] = await to(transactionsAPI.broadcast(activeToken, transaction, network));

  if (error) return dispatch(broadcastedTransactionError(({ error, transaction })));

  dispatch(broadcastedTransactionSuccess(transaction));

  dispatch(addPendingTransaction({
    amount: transaction.amount,
    asset: { reference: transaction.data },
    fee: Fees.send,
    id: tx.id,
    recipientId: transaction.recipientId,
    senderId: account.info[activeToken].address,
    senderPublicKey: account.publicKey,
    type: transactionTypes.send,
    token: activeToken,
  }));

  return dispatch(passphraseUsed(transaction.passphrase));
};
