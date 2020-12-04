export const getConnectedPeers = data => new Promise(resolve =>
  resolve({ endpoint: 'getConnectedPeers', token: 'LSK', data }));

export const getNetworkStatus = data => new Promise(resolve =>
  resolve({ endpoint: 'getNetworkStatus', token: 'LSK', data }));

export const getNetworkStatistics = data => new Promise(resolve =>
  resolve({ endpoint: 'getNetworkStatistics', token: 'LSK', data }));
