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
    name: networkKeys.mainnet,
    label: 'Mainnet',
    serviceUrl: 'http://165.227.246.146:9901',
    wsServiceUrl: 'ws://mainnet-service.lisk.com',
  },
  [networkKeys.alphanet]: {
    name: networkKeys.alphanet,
    label: 'Alphanet',
    serviceUrl: 'http://alphanet-service.liskdev.net',
    wsServiceUrl: 'ws://alphanet-service.liskdev.net',
  },
  [networkKeys.betanet]: {
    name: networkKeys.betanet,
    label: 'Betanet',
    serviceUrl: 'http://betanet-service.lisk.com',
    wsServiceUrl: 'ws://betanet-service.lisk.com',
  },
  [networkKeys.devnet]: {
    name: networkKeys.devnet,
    label: 'Devnet',
    serviceUrl: 'http://devnet-service.liskdev.net:9901',
    wsServiceUrl: 'ws://devnet-service.liskdev.net:9901',
  },
  [networkKeys.testnet]: {
    name: networkKeys.testnet,
    label: 'Testnet',
    serviceUrl: 'http://testnet-service.lisk.com',
    wsServiceUrl: 'ws://testnet-service.lisk.com',
  },
  [networkKeys.customNode]: {
    name: networkKeys.customNode,
    label: 'Custom Service Node',
    serviceUrl: 'http://localhost:9901',
    wsServiceUrl: 'ws://localhost:9901',
  },
};

export default networks;
