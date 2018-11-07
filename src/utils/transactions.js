
export default (pendingTransactions, confirmedTransactions) =>
  [...pendingTransactions, ...confirmedTransactions].filter((transactionA, index, self) =>
    index === self.findIndex(transactionB => (
      transactionB.id === transactionA.id
    )));
