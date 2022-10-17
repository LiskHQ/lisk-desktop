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
    serviceUrl: 'https://service.lisk.com',
  },
  [networkKeys.testNet]: {
    label: 'Testnet',
    // @Todo: this should be reverted when stable test service depoyment has been done
    serviceUrl: 'http://165.22.29.229:9901',// 'https://testnet-service.lisk.com',
  },
  [networkKeys.customNode]: {
    label: 'Custom Service Node',

    // a default value, to keep the object signature consistent
    serviceUrl: 'http://localhost:9901',
  },
};

export default networks;
