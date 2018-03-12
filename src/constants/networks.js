import env, { test } from './env';

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

let preferredNetwork = (window.localStorage && window.localStorage.getItem('defaultNetwork')) || /* istanbul ignore next */ env.defaultNetwork;
preferredNetwork = test() ? env.testNetwork : /* istanbul ignore next */ preferredNetwork;
networks.default = networks[preferredNetwork];
module.exports = networks;
