export const networkKeys = {
  mainnet: 'mainnet',
  alphanet: 'alphanet',
  betanet: 'betanet',
  devnet: 'devnet',
  testnet: 'testnet',
  customNode: 'customNode',
};

// eslint-disable-next-line no-unused-vars
export const initialSupply = 10000000000000000;

const networks = {
  [networkKeys.mainnet]: {
    label: 'Mainnet',
    serviceUrl: 'http://165.227.246.146:9901',
    wsServiceUrl: 'ws://165.227.246.146:9901',
  },
  [networkKeys.alphanet]: {
    label: 'Alphanet',
    serviceUrl: 'http://165.227.246.146:9901',
    wsServiceUrl: 'ws://165.227.246.146:9901',
  },
  [networkKeys.betanet]: {
    label: 'Betanet',
    serviceUrl: 'http://165.227.246.146:9901',
    wsServiceUrl: 'ws://165.227.246.146:9901',
  },
  [networkKeys.devnet]: {
    label: 'Devnet',
    serviceUrl: 'http://165.227.246.146:9901',
    wsServiceUrl: 'ws://165.227.246.146:9901',
  },
  [networkKeys.testnet]: {
    label: 'Testnet',
    // @Todo: this should be reverted when stable test service depoyment has been done
    serviceUrl: 'http://165.227.246.146:9901', // 'https://testnet-service.lisk.com',
    wsServiceUrl: 'ws://165.227.246.146:9901',
  },
  [networkKeys.customNode]: {
    label: 'Custom Service Node',
    serviceUrl: 'http://localhost:9901',
    wsServiceUrl: 'ws://localhost:9901',
  },
};

export default networks;
