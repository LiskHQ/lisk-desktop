import i18next from 'i18next';
import actionTypes from '../constants/actions';
import { loadingStarted, loadingFinished } from '../utils/loading';
import { send, getTransactions, getSingleTransaction, unconfirmedTransactions } from '../utils/api/transactions';
import { getDelegate } from '../utils/api/delegate';
import { loadDelegateCache } from '../utils/delegates';
import { extractAddress } from '../utils/account';
import { loadAccount, passphraseUsed } from './account';
import Fees from '../constants/fees';
import { toRawLsk } from '../utils/lsk';
import transactionTypes from '../constants/transactionTypes';

export const transactionsFilterSet = ({
  activePeer, address, limit, filter,
}) =>
  (dispatch) => {
    getTransactions({
      activePeer,
      address,
      limit,
      filter,
    }).then((response) => {
      dispatch({
        data: {
          confirmed: response.data,
          count: parseInt(response.count, 10),
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

export const transactionsUpdateUnconfirmed = ({ activePeer, address, pendingTransactions }) =>
  (dispatch) => {
    unconfirmedTransactions(activePeer, address).then(response => dispatch({
      data: {
        failed: pendingTransactions.filter(tx =>
          response.transactions.filter(unconfirmedTx => tx.id === unconfirmedTx.id).length === 0),
      },
      type: actionTypes.transactionsFailed,
    }));
  };

export const loadTransactionsFinish = accountUpdated =>
  (dispatch) => {
    loadingFinished(actionTypes.transactionsLoad);
    dispatch({
      data: accountUpdated,
      type: actionTypes.transactionsLoadFinish,
    });
  };

export const loadTransactions = ({ activePeer, publicKey, address }) =>
  (dispatch) => {
    const lastActiveAddress = publicKey && extractAddress(publicKey);
    const isSameAccount = lastActiveAddress === address;
    loadingStarted(actionTypes.transactionsLoad);
    getTransactions({ activePeer, address, limit: 25 })
      .then((transactionsResponse) => {
        dispatch(loadAccount({
          activePeer,
          address,
          transactionsResponse,
          isSameAccount,
        }));
        dispatch({
          data: {
            count: parseInt(transactionsResponse.count, 10),
            confirmed: transactionsResponse.data,
          },
          type: actionTypes.transactionsLoaded,
        });
      });
  };

export const transactionsRequested = ({
  activePeer, address, limit, offset, filter,
}) =>
  (dispatch) => {
    getTransactions({
      activePeer, address, limit, offset, filter,
    })
      .then((response) => {
        dispatch({
          data: {
            count: parseInt(response.count, 10),
            confirmed: response.data,
            address,
            filter,
          },
          type: actionTypes.transactionsLoaded,
        });
      });
  };

export const loadTransaction = ({ activePeer, id }) =>
  (dispatch) => {
    dispatch({ type: actionTypes.transactionCleared });
    getSingleTransaction({ activePeer, id })
      .then((response) => {
        const added = (response.transaction.votes && response.transaction.votes.added) || [];
        const deleted = (response.transaction.votes && response.transaction.votes.deleted) || [];
        const localStorageDelegates = activePeer.options && loadDelegateCache(activePeer);
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
                  data: { delegate: delegateData.delegate, voteArrayName: 'deleted' },
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
                  data: { delegate: delegateData.delegate, voteArrayName: 'added' },
                  type: actionTypes.transactionAddDelegateName,
                });
              });
          }
        });
        dispatch({ data: response, type: actionTypes.transactionLoaded });
      }).catch((error) => {
        dispatch({ data: error, type: actionTypes.transactionLoadFailed });
      });
  };

export const transactionsUpdated = ({
  activePeer, address, limit, filter, pendingTransactions,
}) =>
  (dispatch) => {
    getTransactions({
      activePeer, address, limit, filter,
    })
      .then((response) => {
        dispatch({
          data: {
            confirmed: response.data,
            count: parseInt(response.count, 10),
          },
          type: actionTypes.transactionsUpdated,
        });
        if (pendingTransactions.length) {
          dispatch(transactionsUpdateUnconfirmed({
            activePeer,
            address,
            pendingTransactions,
          }));
        }
      });
  };

export const sent = ({
  activePeer, account, recipientId, amount, passphrase, secondPassphrase,
}) =>
  (dispatch) => {
    send(activePeer, recipientId, toRawLsk(amount), passphrase, secondPassphrase)
      .then((data) => {
        dispatch({
          data: {
            id: data.transactionId,
            senderPublicKey: account.publicKey,
            senderId: account.address,
            recipientId,
            amount: toRawLsk(amount),
            fee: Fees.send,
            type: transactionTypes.send,
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
