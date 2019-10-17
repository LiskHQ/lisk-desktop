export default {
  send: 0,
  setSecondPassphrase: 1,
  registerDelegate: 2,
  vote: 3,
};

export const transactionNames = t => ({
  0: t('Send'),
  1: t('Second passphrase registration'),
  2: t('Delegate registration'),
  3: t('Delegate vote'),
  4: t('Multisignature Creation'),
  5: t('Blockchain Application Registration'),
  6: t('Send Lisk to Blockchain Application'),
  7: t('Send Lisk from Blockchain Application'),
});

export const createTransactionType = {
  transaction: 'transfer',
  delegate_registration: 'registerDelegate',
};
