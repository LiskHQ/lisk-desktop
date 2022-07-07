const blockchainApplicationsManage = [
  {
    name: 'Test app',
    chainID: 'aq02qkbb35u4jdq8szo3pnsq',
    state: 'active',
    nodeURL: ['https://service.lisk.com'],
    logoURL: 'https://service.lisk.com',
    lastUpdated: 123456789,
  },
  {
    name: 'Demo app',
    chainID: 'aq86llsb35u4syc8aet7xenf',
    state: 'active',
    nodeURL: ['https://service.demoapp.com'],
    logoURL: 'https://service.demoapp.com',
    lastUpdated: 456123789,
  },
  {
    name: 'Kalipo',
    chainID: 'aq25derd17a4syc8aet3pryt',
    state: 'active',
    nodeURL: ['https://service.kalipo.com'],
    logoURL: 'https://service.kalipo.com',
    lastUpdated: 789456123,
  },
  {
    name: 'DoEdu',
    chainID: 'aq96eeqk77r4syc8aet9fcey',
    state: 'active',
    nodeURL: ['https://service.doedu.com'],
    logoURL: 'https://service.doedu.com',
    lastUpdated: 789123456,
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
