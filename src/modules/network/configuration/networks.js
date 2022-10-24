export const networkKeys = {
  mainNet: 'mainnet',
  alphanet: 'alphanet',
  betanet: 'betanet',
  devNet: 'devnet',
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
    // @Todo: this should be reverted when stable test service depoyment has been done
    serviceUrl: 'http://165.227.246.146:9901', // 'https://testnet-service.lisk.com',
  },
  [networkKeys.customNode]: {
    label: 'Custom Service Node',

    // a default value, to keep the object signature consistent
    serviceUrl: 'http://localhost:9901',
  },
};

export default networks;
