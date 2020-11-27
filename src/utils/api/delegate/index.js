export const getDelegate = data => new Promise(resolve =>
  resolve({ endpoint: 'getDelegate', token: 'LSK', data }));

export const getDelegates = data => new Promise(resolve =>
  resolve({ endpoint: 'getDelegates', token: 'LSK', data }));

export const getVotes = data => new Promise(resolve =>
  resolve({ endpoint: 'getVotes', token: 'LSK', data }));

export const getVoters = data => new Promise(resolve =>
  resolve({ endpoint: 'getVoters', token: 'LSK', data }));

export const getForgers = data => new Promise(resolve =>
  resolve({ endpoint: 'getForgers', token: 'LSK', data }));
