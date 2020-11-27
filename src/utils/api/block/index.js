export const getBlock = data => new Promise(resolve =>
  resolve({ endpoint: 'getBlock', token: 'shared', data }));

export const getBlocks = data => new Promise(resolve =>
  resolve({ endpoint: 'getBlocks', token: 'shared', data }));
