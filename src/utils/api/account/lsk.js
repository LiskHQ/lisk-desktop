export const getAccount = data => new Promise(resolve =>
  resolve({ endpoint: 'getAccount', token: 'LSK', data }));

export const getAccounts = data => new Promise(resolve =>
  resolve({ endpoint: 'getAccounts', token: 'LSK', data }));
