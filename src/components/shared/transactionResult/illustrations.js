export default {
  default: {
    pending: 'transactionPending',
    success: 'transactionSuccess',
    error: 'transactionError',
  },
  vote: {
    pending: 'votingSuccess',
    success: 'votingSuccess',
    error: 'transactionError',
  },
  registerMultisignature: {
    pending: 'registerMultisignatureSuccess',
    success: 'registerMultisignatureSuccess',
    error: 'registerMultisignatureError',
  },
  signMultisignature: {
    SIGN_SUCCEEDED: 'registerMultisignatureSuccess',
    SIGN_FAILED: 'registerMultisignatureError',
    BROADCASTED: 'transactionSuccess',
    BROADCAST_FAILED: 'transactionError',
    PENDING: 'registerMultisignatureSuccess',
  },
};
