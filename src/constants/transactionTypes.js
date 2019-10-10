export default {
  send: 0,
  setSecondPassphrase: 1,
  registerDelegate: 2,
  vote: 3,
};

export const transactionNames = {
  0: 'Send',
  1: 'Second passphrase registration',
  2: 'Delegate registration',
  3: 'Delegate vote',
};

export const createTransactionType = {
  transaction: 'transfer',
  delegate_registration: 'registerDelegate',
};
