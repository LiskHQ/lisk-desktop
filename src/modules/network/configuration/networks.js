export const networkKeys = {
  mainNet: 'mainnet',
  testNet: 'testnet',
  customNode: 'customNode',
};

// eslint-disable-next-line no-unused-vars
export const initialSupply = 10000000000000000;

const networks = {
  [networkKeys.mainNet]: {
    label: 'Mainnet',
    serviceUrl: 'http://165.227.246.146:9901',
  },
  [networkKeys.testNet]: {
    label: 'Testnet',
    serviceUrl: 'http://165.227.246.146:9901',
  },
  [networkKeys.customNode]: {
    label: 'Custom Service Node',

    // a default value, to keep the object signature consistent
    serviceUrl: 'http://localhost:9901',
  },
};

export default networks;
