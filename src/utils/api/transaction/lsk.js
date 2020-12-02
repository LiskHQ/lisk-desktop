export const getTransaction = data => new Promise(resolve =>
  resolve({ endpoint: 'getTransaction', token: 'LSK', data }));

export const getTransactions = data => new Promise(resolve =>
  resolve({ endpoint: 'getTransactions', token: 'LSK', data }));

export const getRegisteredDelegates = data => new Promise(resolve =>
  resolve({ endpoint: 'getRegisteredDelegates', token: 'LSK', data }));

export const getTransactionStats = data => new Promise(resolve =>
  resolve({ endpoint: 'getTransactionStats', token: 'LSK', data }));
