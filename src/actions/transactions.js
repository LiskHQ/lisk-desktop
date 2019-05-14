/* eslint-disable max-lines */
import i18next from 'i18next';
import to from 'await-to-js';
import actionTypes from '../constants/actions';
import { loadingStarted, loadingFinished } from '../actions/loading';
import { getTransactions, getSingleTransaction, unconfirmedTransactions } from '../utils/api/transactions';
import { getDelegate } from '../utils/api/delegate';
import { loadDelegateCache } from '../utils/delegates';
import { extractAddress } from '../utils/account';
import { loadAccount, passphraseUsed } from './account';
import { getTimeOffset } from '../utils/hacks';
import Fees from '../constants/fees';
import transactionTypes from '../constants/transactionTypes';
import { sendWithHW } from '../utils/api/hwWallet';
import { loginType } from '../constants/hwConstants';
import { transactions as transactionsAPI } from '../utils/api';

export const cleanTransactions = () => ({
  type: actionTypes.cleanTransactions,
});

export const transactionAdded = data => ({
  data,
  type: actionTypes.transactionAdded,
});

export const testExtensions = () => ({
  type: 'extensinonTest',
});

export const transactionsFilterSet = ({
  address, limit, filter, customFilters = {},
}) => (dispatch, getState) => {
  const networkConfig = getState().network;

  dispatch(loadingStarted(actionTypes.transactionsFilterSet));

  return getTransactions({
    networkConfig,
    address,
    limit,
    filter,
    customFilters,
  }).then((response) => {
    dispatch({
      data: {
        confirmed: response.data,
        count: parseInt(response.meta.count, 10),
        filter,
        customFilters,
      },
      type: actionTypes.transactionsFiltered,
    });
    if (filter !== undefined) {
      dispatch({
        data: {
          filterName: 'wallet',
          value: filter,
        },
        type: actionTypes.addFilter,
      });
    }
    dispatch(loadingFinished(actionTypes.transactionsFilterSet));
  });
};

export const transactionsUpdateUnconfirmed = ({ address, pendingTransactions }) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    return unconfirmedTransactions(liskAPIClient, address).then(response => dispatch({
      data: {
        failed: pendingTransactions.filter(tx =>
          response.data.filter(unconfirmedTx => tx.id === unconfirmedTx.id).length === 0),
      },
      type: actionTypes.transactionsFailed,
    }));
  };

export const loadTransactionsFinish = accountUpdated =>
  (dispatch) => {
    dispatch(loadingFinished(actionTypes.transactionsLoad));
    dispatch({
      data: accountUpdated,
      type: actionTypes.transactionsLoadFinish,
    });
  };

export const loadTransactions = ({ publicKey, address }) =>
  (dispatch, getState) => {
    const networkConfig = getState().network;
    const lastActiveAddress = publicKey && extractAddress(publicKey);
    const isSameAccount = lastActiveAddress === address;
    dispatch(loadingStarted(actionTypes.transactionsLoad));
    getTransactions({ networkConfig, address, limit: 25 })
      .then((transactionsResponse) => {
        dispatch(loadAccount({
          address,
          transactionsResponse,
          isSameAccount,
        }));
        dispatch({
          data: {
            count: parseInt(transactionsResponse.meta.count, 10),
            confirmed: transactionsResponse.data,
          },
          type: actionTypes.transactionsLoaded,
        });
      });
  };

export const transactionsRequested = ({
  address, limit, offset, filter, customFilters = {},
}) =>
  (dispatch, getState) => {
    dispatch(loadingStarted(actionTypes.transactionsRequested));
    const networkConfig = getState().network;
    getTransactions({
      networkConfig, address, limit, offset, filter, customFilters,
    })
      .then((response) => {
        dispatch({
          data: {
            count: parseInt(response.meta.count, 10),
            confirmed: response.data,
            address,
            filter,
          },
          type: actionTypes.transactionsLoaded,
        });
        dispatch(loadingFinished(actionTypes.transactionsRequested));
      });
  };

export const loadLastTransaction = address => (dispatch, getState) => {
  const networkConfig = getState().network;
  if (networkConfig) {
    dispatch({ type: actionTypes.transactionCleared });
    getTransactions({
      networkConfig, address, limit: 1, offset: 0,
    }).then(response => dispatch({ data: response.data[0], type: actionTypes.transactionLoaded }));
  }
};

export const loadTransaction = ({ id }) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    const networkConfig = getState().network;
    dispatch({ type: actionTypes.transactionCleared });
    // TODO remove the btc condition
    getSingleTransaction(localStorage.getItem('btc') ? { networkConfig, id } : { liskAPIClient, id })
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
            getDelegate(liskAPIClient, { publicKey })
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
            getDelegate(liskAPIClient, { publicKey })
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

export const transactionsUpdated = ({
  address, limit, filter, pendingTransactions, customFilters,
}) =>
  (dispatch, getState) => {
    const networkConfig = getState().network;

    getTransactions({
      networkConfig, address, limit, filter, customFilters,
    })
      .then((response) => {
        if (filter === getState().transactions.filter) {
          dispatch({
            data: {
              confirmed: response.data,
              count: parseInt(response.meta.count, 10),
            },
            type: actionTypes.transactionsUpdated,
          });
        }
        // eslint-disable-next-line no-constant-condition
        if (pendingTransactions.length) {
          // this was disabled, because this caused pending transactions
          // to disappear from the list before they appeared again as confirmed.
          // Currently, the problem is that a pending transaction will not be removed
          // from the list if it fails. Caused by Lisk Core 1.0.0
          // TODO: figure out how to make this work again
          /*
          dispatch(transactionsUpdateUnconfirmed({
            liskAPIClient,
            address,
            pendingTransactions,
          }));
          */
        }
      });
  };

const handleSentError = ({
  error, account, transaction, dispatch,
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
    data: {
      errorMessage: text,
      tx: { ...transaction },
    },
    type: actionTypes.transactionFailed,
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
  const { account, network, settings } = getState().account;
  const timeOffset = getTimeOffset(getState());
  const activeToken = settings.token.active;

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
    dispatch(transactionAdded({
      amount: txData.amount,
      asset: { reference: txData.data },
      fee: Fees.send,
      id: broadcastTx.id,
      recipientId: txData.recipientId,
      senderId: account.info[activeToken].address,
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


export const transactionCreated = data => async (dispatch, getState) => {
  let tx;
  const state = getState();
  const { account, settings: { token } } = state;
  const timeOffset = getTimeOffset(state);
  const txData = { ...data, timeOffset };

  // try removing the try catch
  try {
    tx = await transactionsAPI.create(token.active, txData, account.loginType);

    return tx;
  } catch (error) {
    return handleSentError({ error, dispatch });
  }
};

export const transactionBroadcasted = transaction => async (dispatch, getState) => {
  const { account, network, settings: { token } } = getState();

  try {
    const broadcastTx = await transactionsAPI.broadcast(token.active, transaction, network);

    dispatch(transactionAdded({
      amount: transaction.amount,
      asset: { reference: transaction.data },
      fee: Fees.send,
      id: broadcastTx.id,
      recipientId: transaction.recipientId,
      senderId: account.info[token.active].address,
      senderPublicKey: account.publicKey,
      type: transactionTypes.send,
    }));

    dispatch(passphraseUsed(transaction.passphrase));
  } catch (error) {
    handleSentError({ error, transaction, dispatch });
  }
};
