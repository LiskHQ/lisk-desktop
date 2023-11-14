const blockchainApplicationsExplore = [
  {
    chainName: 'Lisk',
    chainID: '00000001',
    status: 'active',
    apis: [{ rest: 'https://service.lisk.com', rpc: 'wss://service.lisk.com' }],
    address: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
    logo: {
      png: 'https://lisk-qa.ams3.digitaloceanspaces.com/lisk.png',
      svg: 'https://lisk-qa.ams3.digitaloceanspaces.com/lisk.svg',
    },
    lastCertificateHeight: 1000,
    lastUpdated: 1666566000000,
    escrowedLSK: 50000000,
  },
  {
    chainName: 'Colecti',
    chainID: '00000002',
    status: 'active',
    apis: [
      { rest: 'https://service.colecti.com', rpc: 'wss://service.colecti.com' },
      { rest: 'https://testnet.colecti.com', rpc: 'wss://testnet.colecti.com' },
    ],
    address: 'lsk24cd35u4jdq8ssd03pnsqe5dsxwrnazyqqqg5eu',
    logo: {
      png: 'https://lisk-qa.ams3.digitaloceanspaces.com/colecti.png',
      svg: 'https://lisk-qa.ams3.digitaloceanspaces.com/colecti.svg',
    },
    lastCertificateHeight: 900,
    lastUpdated: 1666566000000,
    escrowedLSK: 500000000,
  },
];

export default blockchainApplicationsExplore;
