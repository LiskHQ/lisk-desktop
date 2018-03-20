const networks = {
  mainnet: { // network name translation t('Mainnet');
    name: 'Mainnet',
    ssl: true,
    port: 443,
    code: 0,
  },
  testnet: { // network name translation t('Testnet');
    name: 'Testnet',
    testnet: true,
    ssl: true,
    port: 443,
    code: 1,
  },
  customNode: { // network name translation t('Custom Node');
    name: 'Custom Node',
    custom: true,
    address: 'http://localhost:4000',
    code: 2,
  },
};

networks.default = networks[window.localStorage && window.localStorage.getItem('defaultNetwork')] || networks.mainnet;
module.exports = networks;
