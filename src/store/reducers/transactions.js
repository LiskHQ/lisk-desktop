import { actionTypes } from '@constants';

const addNewTransactions = (array1, array2) => array1.filter(array1Value =>
  array2.filter(array2Value => array2Value.id === array1Value.id).length === 0);

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
  transactionsCreated: [],
  transactionsCreatedFailed: [],
  broadcastedTransactionsError: [],
};
const transactions = (state = initialState, action) => { // eslint-disable-line complexity
  switch (action.type) {
    // Used for cleaning the state, specially when the account signs out
    case actionTypes.emptyTransactionsData:
      return initialState;

    // Used to insert a the broadcasted transaction to the list
    // before the tx is approved.
    case actionTypes.addNewPendingTransaction:
      return {
        ...state,
        pending: [action.data, ...state.pending],
      };

    case actionTypes.transactionFailed:
      return { ...state, failed: { ...action.data } };
    case actionTypes.transactionsRetrieved: {
      const confirmed = action.data.offset === 0
        ? [
          ...addNewTransactions(action.data.confirmed, state.confirmed),
          ...state.confirmed,
        ] : [
          ...state.confirmed,
          ...addNewTransactions(action.data.confirmed, state.confirmed),
        ];
      return {
        ...state,
        confirmed,
        count: action.data.count,
        filters: action.data.filters || state.filters,
        pending: addNewTransactions(state.pending, action.data.confirmed),
      };
    }
    // TODO can be remove after move send (create) tx to utils file
    // istanbul ignore next
    case actionTypes.transactionCreatedSuccess:
      return {
        ...state,
        transactionsCreated: action.data,
      };
    // TODO can be remove after move send (create) tx to utils file
    // istanbul ignore next
    case actionTypes.transactionCreatedError: {
      const { message = 'The transaction failed', name = 'TransactionFailedError' } = action.data;
      return {
        ...state,
        transactionsCreatedFailed: { message, name },
      }; }
    // TODO can be remove after use HOC for send (broadcast) tx
    // istanbul ignore next
    case actionTypes.broadcastedTransactionSuccess:
      return {
        ...state,
        transactionsCreated: state.transactionsCreated.filter(tx => tx.id !== action.data.id),
        broadcastedTransactionsError: state.broadcastedTransactionsError
          .filter(tx => tx.transaction.id !== action.data.id),
      };
    // TODO can be remove after use HOC for send (broadcast) tx
    // istanbul ignore next
    case actionTypes.broadcastedTransactionError:
      return {
        ...state,
        transactionsCreated: state.transactionsCreated.filter(tx => tx.id !== action.data.id),
        broadcastedTransactionsError: state.broadcastedTransactionsError
          .some(tx => tx.transaction.id === action.data.transaction.id)
          ? state.broadcastedTransactionsError.map((tx) => {
            if (tx.transaction.id === action.data.transaction.id) {
              return action.data;
            }
            return tx;
          })
          : [...state.broadcastedTransactionsError, action.data],
      };
    // TODO can be remove after use HOC for send tx
    case actionTypes.resetTransactionResult:
      return {
        ...state,
        transactionsCreated: [],
        transactionsCreatedFailed: [],
        broadcastedTransactionsError: [],
      };
    case (actionTypes.accountSwitched):
      return {
        ...state, pending: [], confirmed: [], count: 0,
      };
    default:
      return state;
  }
};

export default transactions;
