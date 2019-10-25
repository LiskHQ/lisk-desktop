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
  4: t('Multisignature creation'),
  5: t('Blockchain application registration'),
  6: t('Send Lisk to blockchain application'),
  7: t('Send Lisk from blockchain application'),
});

export const createTransactionType = {
  transaction: 'transfer',
  delegate_registration: 'registerDelegate',
};
