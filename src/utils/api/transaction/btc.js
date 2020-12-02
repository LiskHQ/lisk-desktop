export const getTransaction = data => new Promise(resolve =>
  resolve({ endpoint: 'getTransaction', token: 'BTC', data }));

export const getTransactions = data => new Promise(resolve =>
  resolve({ endpoint: 'getTransactions', token: 'BTC', data }));
