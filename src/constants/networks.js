export const networkKeys = {
  mainNet: 'mainnet',
  testNet: 'testnet',
  customNode: 'customNode',
};

const initialSupply = 10000000000000000;

const networks = {
  [networkKeys.mainNet]: {
    label: 'Mainnet',
    serviceUrl: '', // @todo add service url for mainnet when defined
  },
  [networkKeys.testNet]: {
    label: 'Testnet',
    serviceUrl: '', // @todo add service url for testnet when defined
  },
  [networkKeys.customNode]: {
    label: 'Custom Node',
    serviceUrl: 'localhost:9901', // a default value. would usually be the one entered by the user
  },
};

export default networks;
