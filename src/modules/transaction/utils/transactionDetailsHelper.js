export const getValidatorName = (transaction, activeToken) =>
  activeToken === 'LSK' && transaction.params && transaction.params.username
    ? transaction.params.username
    : null;

export const getTxAsset = (tx) => {
  if (tx.params?.data && tx.params.data.length) {
    return tx.params.data;
  }
  return '-';
};
