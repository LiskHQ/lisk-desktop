const blockchainApplicationsManage = [
  {
    name: 'Lisk',
    chainID: '00000001',
    state: 'active',
    serviceURLs: [{ rest: 'http://104.248.241.229:9901', rpc: 'ws://104.248.241.229:9901/rpc-v3' }],
    address: 'lsk24cd35u49jd8szo3pnsqe5dsxwrnazyqqqg5eu',
    logo: {
      png: 'http://www.dummylogo.png',
    },
    lastUpdated: 123456789,
    lastCertificateHeight: 9000,
    isDefault: true,
  },
  {
    name: 'Colecti',
    chainID: 'mi34vyyd12g2lkf0rza1irws',
    state: 'active',
    serviceURLs: [{ rest: 'https://service.colecti.com', rpc: 'wss://service.colecti.com' }],
    address: 'lsk2423d5u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
    logo: {
      png: 'http://www.dummylogo.png',
    },
    lastUpdated: 123789456,
    lastCertificateHeight: 1111,
    isDefault: true,
  },
  {
    name: 'Enevti',
    chainID: 'aq86llsb35u4syc8aet7xenf',
    state: 'active',
    serviceURLs: [{ rest: 'https://service.enevti.com', rpc: 'wss://service.enevti.com' }],
    address: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazvftqg5eu',
    logo: {
      png: 'http://www.dummylogo.png',
    },
    lastCertificateHeight: 700,
    lastUpdated: 456123789,
    isDefault: true,
  },
  {
    name: 'DoEdu',
    chainID: 'aq96eeqk77r4syc8aet9fcey',
    state: 'terminated',
    serviceURLs: [{ rest: 'https://service.doedu.com', rpc: 'wss://service.doedu.com' }],
    address: 'lsk24cd35u4jdq8szo3pnsqe5dmdfrnazyqqqg5eu',
    logo: {
      png: 'http://www.dummylogo.png',
    },
    lastUpdated: 789123456,
    lastCertificateHeight: 100,
    isDefault: false,
  },
  {
    name: 'Kalipo',
    chainID: 'aq25derd17a4syc8aet3pryt',
    state: 'active',
    serviceURLs: [
      { rest: 'https://service.kalipo.com', rpc: 'wss://service.kalipo.com' },
      { rest: 'https://testnet.kalipo.com', rpc: 'wss://testnet.kalipo.com' },
    ],
    address: 'lsk24cd35u4jdq8szo3pnsqe5gb5wrnazyqqqg5eu',
    logo: {
      png: 'http://www.dummylogo.png',
    },
    lastCertificateHeight: 10000,
    lastUpdated: 789456123,
    isDefault: false,
  },
  {
    name: 'Lisk DEX',
    chainID: 'dz38fkbb35u4jdq8szo3pnsq',
    state: 'active',
    serviceURLs: [{ rest: 'https://service.liskdex.com', rpc: 'wss://service.liskdex.com' }],
    address: 'lsk24cd35u4fwq8szo3pnsqe5dsxwrnazyqqqg5eu',
    logo: {
      png: 'http://www.dummylogo.png',
    },
    lastCertificateHeight: 900,
    lastUpdated: 123456789,
    isDefault: true,
  },
];

export const applicationsMap = blockchainApplicationsManage.reduce(
  (obj, val) => {
    obj[val.chainID] = val;
    return obj;
  },
  {},
);

export default blockchainApplicationsManage;
