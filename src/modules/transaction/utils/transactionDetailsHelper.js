export const getDelegateName = (transaction, activeToken) =>
  (activeToken === 'LSK' && transaction.asset && transaction.asset.username
    ? transaction.asset.username
    : null);

export const getTxAsset = (tx) => {
  if (tx.asset?.data && tx.asset.data.length) {
    return tx.asset.data;
  }
  return '-';
};
