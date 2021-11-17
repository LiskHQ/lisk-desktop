export default {
  default: {
    SIGNATURE_SUCCESS: 'transactionPending',
    BROADCAST_SUCCESS: 'transactionSuccess',
    BROADCAST_ERROR: 'transactionError',
    SIGNATURE_ERROR: 'transactionError',
  },
  vote: {
    SIGNATURE_SUCCESS: 'votingSuccess',
    BROADCAST_SUCCESS: 'votingSuccess',
    BROADCAST_ERROR: 'transactionError',
    SIGNATURE_ERROR: 'transactionError',
  },
  registerMultisignature: {
    SIGNATURE_SUCCESS: 'registerMultisignatureSuccess',
    BROADCAST_SUCCESS: 'registerMultisignatureSuccess',
    BROADCAST_ERROR: 'registerMultisignatureError',
    SIGNATURE_ERROR: 'registerMultisignatureError',
  },
  signMultisignature: {
    MUILTISIG_SIGNATURE_PARTIAL_SUCCESS: 'multisignaturePartialSuccess',
    SIGNATURE_SUCCESS: 'registerMultisignatureSuccess',
    SIGNATURE_ERROR: 'registerMultisignatureError',
    BROADCAST_SUCCESS: 'transactionSuccess',
    BROADCAST_ERROR: 'transactionError',
  },
};
