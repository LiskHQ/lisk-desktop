import actionTypes from '../constants/actions';

/**
 * An action to dispatch transactionAdded
 *
 */
export const transactionAdded = data => ({
  data,
  type: actionTypes.transactionAdded,
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
