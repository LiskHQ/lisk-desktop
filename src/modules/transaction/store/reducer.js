import actionTypes from './actionTypes';

const addNewTransactions = (array1, array2) =>
  array1.filter(
    (array1Value) => array2.filter((array2Value) => array2Value.id === array1Value.id).length === 0
  );

/**
 * Initial State
 * @param {Array} state
 * @param {Object} action
 */
const initialState = {
  pending: [],
  confirmed: [],
  count: null,
  filters: {
    dateFrom: '',
    dateTo: '',
    amountFrom: '',
    amountTo: '',
    message: '',
  },
  signedTransaction: {},
  txSignatureError: null,
  txBroadcastError: null,
};
// @TODO needs care and attention
// eslint-disable-next-line complexity
const transactions = (state = initialState, action) => {
  // eslint-disable-line complexity
  switch (action.type) {
    // Used for cleaning the state, specially when the account signs out
    case actionTypes.emptyTransactionsData:
      return initialState;

    // Used to insert a the broadcasted transaction to the list
    // before the tx is approved.
    case actionTypes.pendingTransactionAdded:
      return {
        ...state,
        pending: [action.data, ...state.pending],
      };

    // Depending on the offset,
    // Stores the latest txs at the top of the list
    // and older txs at the bottom.
    case actionTypes.transactionsRetrieved: {
      const confirmed =
        action.data.offset === 0
          ? [...addNewTransactions(action.data.confirmed, state.confirmed), ...state.confirmed]
          : [...state.confirmed, ...addNewTransactions(action.data.confirmed, state.confirmed)];
      return {
        ...state,
        confirmed,
        count: action.data.count,
        filters: action.data.filters || state.filters,
        pending: addNewTransactions(state.pending, action.data.confirmed),
      };
    }

    // Stored the signed transaction to be used for broadcasting or downloading
    case actionTypes.transactionCreatedSuccess:
    case actionTypes.signatureSkipped:
    case actionTypes.transactionSigned:
      return {
        ...state,
        signedTransaction: action.data,
      };

    // Stores the transaction signature error. This error is thrown at the time of
    // creating the raw transaction object or signing it using Lisk Element.
    case actionTypes.transactionSignError:
      return {
        ...state,
        txSignatureError: {
          ...action.data,
          message: action.data.message ?? 'The transaction failed',
          name: 'TransactionFailedError',
        },
      };

    // Removes the signed transactions and previous errors.
    // We've already broadcasted, we don't need them any longer.
    case actionTypes.broadcastedTransactionSuccess:
      return {
        ...state,
        signedTransaction: {},
        txBroadcastError: null,
      };

    // Stores the transaction broadcast error returned by the API
    case actionTypes.broadcastedTransactionError:
      return {
        ...state,
        signedTransaction: {},
        txBroadcastError: action.data,
      };

    // Removes all errors and the signed transaction
    // To start a fresh transaction.
    case actionTypes.resetTransactionResult:
      return {
        ...state,
        signedTransaction: {},
        txSignatureError: null,
        txBroadcastError: null,
      };
    default:
      return state;
  }
};

export default transactions;
