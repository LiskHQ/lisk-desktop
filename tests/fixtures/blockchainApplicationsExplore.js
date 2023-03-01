const blockchainApplicationsExplore = [
  {
    chainName: 'Test app',
    chainID: '00000001',
    status: 'active',
    apis: [{ rest: 'https://service.testappone.com', rpc: 'wss://service.testappone.com' }],
    address: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
    lastCertificateHeight: 1000,
    lastUpdated: 1666566000000,
    depositedLsk: 50000000,
  },
  {
    chainName: 'Test app 2',
    chainID: '00000002',
    status: 'active',
    apis: [
      { rest: 'https://service.testapptwo.com', rpc: 'wss://service.testapptwo.com' },
      { rest: 'https://testnet.testapptwo.com', rpc: 'wss://testnet.testapptwo.com' },
    ],
    address: 'lsk24cd35u4jdq8ssd03pnsqe5dsxwrnazyqqqg5eu',
    lastCertificateHeight: 900,
    lastUpdated: 1666566000000,
    depositedLsk: 500000000,
  },
];

export default blockchainApplicationsExplore;
