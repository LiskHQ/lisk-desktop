import actionTypes from '../constants/actions';
import { loadingStarted, loadingFinished } from '../utils/loading';
import { transactions, transaction } from '../utils/api/account';
import { getDelegate } from '../utils/api/delegate';
import { extractAddress } from '../utils/account';
import { loadAccount } from './account';

/**
 * An action to dispatch transactionAdded
 *
 */
export const transactionAdded = data => ({
  data,
  type: actionTypes.transactionAdded,
});

/**
 * An action to dispatch transactionFailed
 *
 */
export const transactionFailed = ({ errorMessage }) => ({
  data: { errorMessage },
  type: actionTypes.transactionFailed,
});

/**
 * An action to dispatch transactionsFailed
 *
 */
export const transactionsFailed = data => ({
  data,
  type: actionTypes.transactionsFailed,
});

/**
 * An action to dispatch transactionsUpdated
 *
 */
export const transactionsUpdated = data => ({
  data,
  type: actionTypes.transactionsUpdated,
});

/**
 * An action to dispatch transactionsLoaded
 *
 */
export const transactionsLoaded = data => ({
  data,
  type: actionTypes.transactionsLoaded,
});

export const transactionsFilterSet = data => ({
  data,
  type: actionTypes.transactionsFilterSet,
});

export const transactionsFiltered = data => ({
  data,
  type: actionTypes.transactionsFiltered,
});

export const transactionsInit = data => ({
  data,
  type: actionTypes.transactionsInit,
});

export const transactionLoaded = data => ({
  data,
  type: actionTypes.transactionLoaded,
});

export const transactionLoadFailed = data => ({
  data,
  type: actionTypes.transactionLoadFailed,
});

export const transactionAddDelegateName = ({ delegate, voteArrayName }) => ({
  delegate,
  voteArrayName,
  type: actionTypes.transactionAddDelegateName,
});

export const transactionInit = () => ({
  type: actionTypes.transactionInit,
});

export const loadTransactions = accountUpdated =>
  (dispatch) => {
    loadingFinished('transactions-init');
    dispatch(transactionsInit(accountUpdated));
  };

export const getTransactionsForAccount = ({ activePeer, publicKey, address }) =>
  (dispatch) => {
    const lastActiveAddress = publicKey ?
      extractAddress(publicKey) :
      null;
    const isSameAccount = lastActiveAddress === address;
    dispatch(transactionInit());
    loadingStarted('transactions-init');
    transactions({ activePeer, address, limit: 25 })
      .then((transactionsResponse) => {
        dispatch(loadAccount({
          activePeer,
          address,
          transactionsResponse,
          isSameAccount,
        }));
      });
  };


export const loadTransaction = ({ activePeer, id }) =>
  (dispatch) => {
    transaction({ activePeer, id })
      .then((response) => {
        const added = (response.transaction.votes && response.transaction.votes.added) || [];
        const deleted = (response.transaction.votes && response.transaction.votes.deleted) || [];

        deleted.map(publicKey =>
          getDelegate(activePeer, { publicKey })
            .then((delegateData) => {
              dispatch(transactionAddDelegateName({ delegate: delegateData.delegate, voteArrayName: 'deleted' }));
            }),
        );

        added.map(publicKey =>
          getDelegate(activePeer, { publicKey })
            .then((delegateData) => {
              dispatch(transactionAddDelegateName({ delegate: delegateData.delegate, voteArrayName: 'added' }));
            }),
        );
        dispatch(transactionLoaded({ ...response }));
      }).catch((error) => {
        dispatch(transactionLoadFailed({ error }));
      });
  };

/**
 *
 *
 */
export const transactionsRequested = ({ activePeer, address, limit, offset, filter }) =>
  (dispatch) => {
    transactions({ activePeer, address, limit, offset, filter })
      .then((response) => {
        dispatch(transactionsLoaded({
          count: parseInt(response.count, 10),
          confirmed: response.transactions,
          address,
          filter,
        }));
      });
  };
