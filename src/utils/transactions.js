import transactionTypes from '../constants/transactionTypes';

const dedupeTransactions = (pendingTransactions, confirmedTransactions) =>
  [...pendingTransactions, ...confirmedTransactions]
    .filter((transactionA, index, self) =>
      index === self.findIndex(transactionB => (
        transactionB.id === transactionA.id
      )));

export const getTxAmount = (transaction) => {
  let amount = transaction.amount !== undefined ? transaction.amount : transaction.asset.amount;
  if (!amount && transaction.type === transactionTypes().unlockToken.code.legacy) {
    amount = 0;
    transaction.asset.unlockingObjects.forEach((unlockedObject) => {
      amount += parseInt(unlockedObject.amount, 10);
    });
    amount = `${amount}`;
  }
  return amount;
};

export default dedupeTransactions;
