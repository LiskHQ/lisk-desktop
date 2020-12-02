export const getAccount = data => new Promise(resolve =>
  resolve({ endpoint: 'getAccount', token: 'BTC', data }));

export const getAccounts = data => new Promise(resolve =>
  resolve({ endpoint: 'getAccounts', token: 'BTC', data }));
