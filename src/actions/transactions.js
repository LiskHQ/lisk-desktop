import actionTypes from '../constants/actions';
import { transactions } from '../utils/api/account';

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

export const transactionsReset = data => ({
  data,
  type: actionTypes.transactionsReset,
});

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
        }));
      });
  };
