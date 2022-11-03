const blockchainApplicationsManage = [
  {
    chainName: 'Lisk',
    chainID: '00000001',
    state: 'active',
    serviceURLs: [{ rest: 'http://165.227.246.146:9901', ws: 'ws://165.227.246.146:9901/rpc-v3' }],
    address: 'lsk24cd35u49jd8szo3pnsqe5dsxwrnazyqqqg5eu',
    logo: {
      png: 'http://www.lisk.png'
    },
    lastUpdated: 123456789,
    lastCertificateHeight: 9000,
    isDefault: true,
  },
  {
    chainName: 'Colecti',
    chainID: 'mi34vyyd12g2lkf0rza1irws',
    state: 'active',
    serviceURLs: [{ rest: 'https://service.colecti.com', ws: 'wss://service.colecti.com' }],
    address: 'lsk2423d5u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
    logo: {
      png: 'http://www.lisk.png'
    },
    lastUpdated: 123789456,
    lastCertificateHeight: 1111,
    isDefault: true,
  },
  {
    chainName: 'Enevti',
    chainID: 'aq86llsb35u4syc8aet7xenf',
    state: 'active',
    serviceURLs: [{ rest: 'https://service.enevti.com', ws: 'wss://service.enevti.com' }],
    address: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazvftqg5eu',
    logo: {
      png: 'http://www.lisk.png'
    },
    lastCertificateHeight: 700,
    lastUpdated: 456123789,
    isDefault: true,
  },
  {
    chainName: 'DoEdu',
    chainID: 'aq96eeqk77r4syc8aet9fcey',
    state: 'terminated',
    serviceURLs: [{ rest: 'https://service.doedu.com', ws: 'wss://service.doedu.com' }],
    address: 'lsk24cd35u4jdq8szo3pnsqe5dmdfrnazyqqqg5eu',
    logo: {
      png: 'http://www.lisk.png'
    },
    lastUpdated: 789123456,
    lastCertificateHeight: 100,
    isDefault: false,
  },
  {
    chainName: 'Kalipo',
    chainID: 'aq25derd17a4syc8aet3pryt',
    state: 'active',
    serviceURLs: [
      { rest: 'https://service.kalipo.com', ws: 'wss://service.kalipo.com' },
      { rest: 'https://testnet.kalipo.com', ws: 'wss://testnet.kalipo.com' },
    ],
    address: 'lsk24cd35u4jdq8szo3pnsqe5gb5wrnazyqqqg5eu',
    logo: {
      png: 'http://www.lisk.png'
    },
    lastCertificateHeight: 10000,
    lastUpdated: 789456123,
    isDefault: false,
  },
  {
    chainName: 'Lisk DEX',
    chainID: 'dz38fkbb35u4jdq8szo3pnsq',
    state: 'active',
    serviceURLs: [{ rest: 'https://service.liskdex.com', ws: 'wss://service.liskdex.com' }],
    address: 'lsk24cd35u4fwq8szo3pnsqe5dsxwrnazyqqqg5eu',
    logo: {
      png: 'http://www.lisk.png'
    },
    lastCertificateHeight: 900,
    lastUpdated: 123456789,
    isDefault: true,
  },
];

export const applicationsMap = blockchainApplicationsManage.reduce((obj, val) => {
  obj[val.chainID] = val;
  return obj;
}, {});

export default blockchainApplicationsManage;
