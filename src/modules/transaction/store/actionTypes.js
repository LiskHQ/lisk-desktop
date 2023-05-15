const actionTypes = {
  emptyTransactionsData: 'EMPTY_TRANSACTIONS_DATA',
  pendingTransactionAdded: 'PENDING_TRANSACTION_ADDED',
  getTransactions: 'GET_TRANSACTIONS',
  getTransactionsSuccess: 'GET_TRANSACTIONS_SUCCESS',
  getTransactionSuccess: 'GET_TRANSACTION_SUCCESS',
  transactionAddValidatorName: 'TRANSACTION_ADD_VALIDATOR_NAME',
  transactionCleared: 'TRANSACTION_CLEARED',
  transactionLoadFailed: 'TRANSACTION_LOAD_FAILED',
  transactionLoadRequested: 'TRANSACTION_LOAD_REQUESTED',
  transactionCreatedSuccess: 'TRANSACTION_CREATED_SUCCESS',
  transactionSignError: 'TRANSACTION_SIGN_ERROR',
  transactionSigned: 'TRANSACTION_SIGNED',
  transactionsRetrieved: 'TRANSACTION_RETRIEVED',
  resetTransactionResult: 'RESET_TRANSACTION_RESULTS',
  broadcastedTransactionSuccess: 'BROADCAST_TRANSACTION_SUCCESS',
  broadcastedTransactionError: 'BROADCASTED_TRANSACTION_ERROR',
  updateTransactions: 'UPDATE_TRANSACTIONS',
  signatureSkipped: 'SIGNATURE_SKIPPED',
};

export default actionTypes;
