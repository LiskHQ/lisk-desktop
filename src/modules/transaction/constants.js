export const FEE_TYPES = {
  BYTES_FEE: 'bytesFee',
  PRIORITY_FEE: 'priorityFee',
  USER_ACCOUNT_INITIALIZATION: 'userAccountInitialization',
  ESCROW_ACCOUNT_INITIALIZATION: 'escrowAccountInitialization',
  VALIDATOR_REGISTRATION: 'validatorRegistration',
};

export const TransactionExecutionResult = {
  INVALID: -1,
  FAIL: 0,
  OK: 1,
};

export const ERROR_EVENTS = {
  insufficientFee: 'Please provide a higher fee to process this transaction.',
  invalidSignature:
    'Failed to process transaction due to invalid signature, please check the transaction.',
};
