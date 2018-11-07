
export default (pendingTransactions, confirmedTransactions) =>
  [...pendingTransactions, ...confirmedTransactions].filter((thing, index, self) =>
    index === self.findIndex(t => (
      t.id === thing.id
    )));
