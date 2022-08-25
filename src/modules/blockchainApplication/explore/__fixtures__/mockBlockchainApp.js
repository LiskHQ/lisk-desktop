/* eslint-disable import/prefer-default-export */
export const mockBlockchainApp = {
  data: [{
    name: 'Lisk',
    chainID: 1,
    state: 'active',
    address: 'lsk123bhithjdq8szo3poyqe5dsxwrnazyqnzqhsy',
    isDefault: true,
    lastCertificateHeight: 900,
    lastUpdated: 123456789,
  }, {
    name: 'Test app',
    chainID: 120,
    state: 'active',
    address: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
    isDefault: false,
    lastCertificateHeight: 1000,
    lastUpdated: 123456789,
  }],
  meta: {
    count: 2,
    offset: 0,
    total: 2,
  },
};
