export const networkKeys = {
  mainNet: 'mainnet',
  testNet: 'testnet',
  customNode: 'customNode',
};

// eslint-disable-next-line no-unused-vars
const initialSupply = 10000000000000000;

const networks = {
  [networkKeys.mainNet]: {
    label: 'Mainnet',
    serviceUrl: 'https://mainnet-service.lisk.io',
  },
  [networkKeys.testNet]: {
    label: 'Testnet',
    serviceUrl: 'https://testnet-service.lisk.io',
  },
  [networkKeys.customNode]: {
    label: 'Custom Node',

    // a default value, to keep the object signature consistent
    serviceUrl: 'http://localhost:9901',
  },
};

export default networks;
