import i18next from 'i18next';
import actionTypes from '../constants/actions';
import { loadingStarted, loadingFinished } from '../actions/loading';
import { send, getTransactions, getSingleTransaction, unconfirmedTransactions } from '../utils/api/transactions';
import { getDelegate } from '../utils/api/delegate';
import { loadDelegateCache } from '../utils/delegates';
import { extractAddress } from '../utils/account';
import { loadAccount, passphraseUsed } from './account';
import { getTimeOffset } from '../utils/hacks';
import Fees from '../constants/fees';
import { toRawLsk } from '../utils/lsk';
import transactionTypes from '../constants/transactionTypes';

export const transactionsFilterSet = ({
  address, limit, filter,
}) => (dispatch, getState) => {
  const activePeer = getState().peers.data;

  return getTransactions({
    activePeer,
    address,
    limit,
    filter,
  }).then((response) => {
    dispatch({
      data: {
        confirmed: response.data,
        count: parseInt(response.meta.count, 10),
        filter,
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
  });
};

export const transactionsUpdateUnconfirmed = ({ address, pendingTransactions }) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    return unconfirmedTransactions(activePeer, address).then(response => dispatch({
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
    const activePeer = getState().peers.data;
    const lastActiveAddress = publicKey && extractAddress(publicKey);
    const isSameAccount = lastActiveAddress === address;
    dispatch(loadingStarted(actionTypes.transactionsLoad));
    getTransactions({ activePeer, address, limit: 25 })
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
  address, limit, offset, filter,
}) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    getTransactions({
      activePeer, address, limit, offset, filter,
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
      });
  };

export const loadTransaction = ({ id }) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    dispatch({ type: actionTypes.transactionCleared });
    getSingleTransaction({ activePeer, id })
      .then((response) => {
        let added = [];
        let deleted = [];

        if (!response.data.length) {
          dispatch({ data: { error: 'Transaction not found' }, type: actionTypes.transactionLoadFailed });
          return;
        }

        // since core 1.0 added and deleted are not filtered in core,
        // but provided as single array with [+,-] signs
        if ('votes' in response.data[0].asset) {
          added = response.data[0].asset.votes.filter(item => item.startsWith('+')).map(item => item.replace('+', ''));
          deleted = response.data[0].asset.votes.filter(item => item.startsWith('-')).map(item => item.replace('-', ''));
        }

        const localStorageDelegates = loadDelegateCache(activePeer);
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
            getDelegate(activePeer, { publicKey })
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
            getDelegate(activePeer, { publicKey })
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
  address, limit, filter, pendingTransactions,
}) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    getTransactions({
      activePeer, address, limit, filter,
    })
      .then((response) => {
        dispatch({
          data: {
            confirmed: response.data,
            count: parseInt(response.meta.count, 10),
          },
          type: actionTypes.transactionsUpdated,
        });
        // eslint-disable-next-line no-constant-condition
        if (pendingTransactions.length) {
          // this was disabled, because this caused pending transactions
          // to disappear from the list before they appeared again as confirmed.
          // Currently, the problem is that a pending transaction will not be removed
          // from the list if it fails. Caused by Lisk Core 1.0.0
          // TODO: figure out how to make this work again
          /*
          dispatch(transactionsUpdateUnconfirmed({
            activePeer,
            address,
            pendingTransactions,
          }));
          */
        }
      });
  };

export const sent = ({
  account, recipientId, amount, passphrase, secondPassphrase, data,
}) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    const timeOffset = getTimeOffset(getState());
    send(activePeer, recipientId, toRawLsk(amount), passphrase, secondPassphrase, data, timeOffset)
      .then((response) => {
        dispatch({
          data: {
            id: response.id,
            senderPublicKey: account.publicKey,
            senderId: account.address,
            recipientId,
            amount: toRawLsk(amount),
            fee: Fees.send,
            type: transactionTypes.send,
            asset: {
              data,
            },
          },
          type: actionTypes.transactionAdded,
        });
      })
      .catch((error) => {
        const errorMessage = error && error.message ? `${error.message}.` : i18next.t('An error occurred while creating the transaction.');
        dispatch({ data: { errorMessage }, type: actionTypes.transactionFailed });
      });
    dispatch(passphraseUsed(passphrase));
  };
