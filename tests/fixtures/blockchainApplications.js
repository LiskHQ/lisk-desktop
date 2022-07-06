const blockchainApplications = [
  {
    name: 'Test app',
    chainID: 'aq02qkbb35u4jdq8szo3pnsq',
    state: 'active',
    address: 'lsk24cd35u4jdq8szo3pnsqe5dsxwrnazyqqqg5eu',
    lastCertificateHeight: 1000,
    lastUpdated: 123456789,
  },
  {
    name: 'Demo app',
    chainID: 'aq86llsb35u4syc8aet7xenf',
    state: 'active',
    address: 'lsksckkjs2c8dnu7vhcku825cp62ed6eyxd8pbt6p',
    lastCertificateHeight: 2000,
    lastUpdated: 456123789,
  },
];

export const applicationsMap = blockchainApplications.reduce(
  (obj, val) => {
    obj[val.chainID] = val;
    return obj;
  },
  {},
);

export default blockchainApplications;
