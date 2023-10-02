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
  insufficientFee: 'Please use custom fee and provide a higher fee to process this transaction.',
  invalidSignature:
    'Failed to process transaction due to invalid signature, please restart the transaction from scratch.',
};

export const TOKEN_EVENT_DATA_RESULT = {
  1: 'Failed to process this transaction due to insufficient balance.',
  2: 'Failed to process this transaction due to message too long',
  3: 'Failed to process this transaction due to invalid token ID',
  4: 'Failed to process this transaction due to token not supported.',
  5: 'Failed to process this transaction due to insufficient locked amount.',
  11: 'Failed to process this transaction due to token ID not available.',
  12: 'Failed to process this transaction due to token ID not native.',
  13: 'Failed to process this transaction due to insufficient escrow balance.',
  14: 'Failed to process this transaction due to invalid receiving chain.',
};

export const VALIDATOR_EVENT_DATA_RESULT = {
  1: 'This address is not registered as validator. Only validators can register a generator key.',
  2: 'This address is already registered as validator.',
  3: 'The BLS key has already been registered in the chain, please check and add a valid BLS key.',
  4: 'Invalid proof of possession for the given BLS key, please check and add a valid proof of possession.',
};
