const blockchainApplicationsExplore = [
  {
    chainName: 'Test app',
    chainID: '00000001',
    state: 'active',
    apis: [{ rest: 'https://service.testappone.com', rpc: 'wss://service.testappone.com' }],
    address: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
    logo: {
      png: 'https://lisk-qa.ams3.digitaloceanspaces.com/Artboard%201%20copy%2019.png',
      svg: 'https://lisk-qa.ams3.digitaloceanspaces.com/Logo-20.svg',
    },
    lastCertificateHeight: 1000,
    lastUpdated: 1666566000000,
    depositedLsk: 50000000,
  },
  {
    chainName: 'Test app 2',
    chainID: '00000002',
    state: 'active',
    apis: [
      { rest: 'https://service.testapptwo.com', rpc: 'wss://service.testapptwo.com' },
      { rest: 'https://testnet.testapptwo.com', rpc: 'wss://testnet.testapptwo.com' },
    ],
    address: 'lsk24cd35u4jdq8ssd03pnsqe5dsxwrnazyqqqg5eu',
    logo: {
      png: 'https://lisk-qa.ams3.digitaloceanspaces.com/Artboard%201%20copy%2019.png',
      svg: 'https://lisk-qa.ams3.digitaloceanspaces.com/Logo-20.svg',
    },
    lastCertificateHeight: 900,
    lastUpdated: 1666566000000,
    depositedLsk: 500000000,
  },
];

export default blockchainApplicationsExplore;
