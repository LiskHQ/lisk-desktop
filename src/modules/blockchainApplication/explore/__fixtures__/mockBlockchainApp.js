/* Two mocks exist for blockchain explore. The mock here matches the response for
 * /blockchain/apps endpoint while the mock in the tests/fixtures folder
 * matches the data here concatenated with the meta data
 */

/* eslint-disable import/prefer-default-export */
export const mockBlockchainApp = {
  data: [
    {
      name: 'Lisk',
      chainID: '00000001',
      status: 'active',
      address: 'lsk123bhithjdq8szo3poyqe5dsxwrnazyqnzqhsy',
      isDefault: true,
      lastCertificateHeight: 900,
      lastUpdated: 123456789,
    },
    {
      name: 'Colecti',
      chainID: '00000002',
      status: 'active',
      address: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
      isDefault: false,
      lastCertificateHeight: 1000,
      lastUpdated: 123456789,
    },
  ],
  meta: {
    count: 2,
    offset: 0,
    total: 2,
  },
};
