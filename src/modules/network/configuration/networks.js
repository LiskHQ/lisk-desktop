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
    serviceUrl: 'http://mainnet-service.lisk.com',
    wsServiceUrl: 'ws://mainnet-service.lisk.com',
    isAvailable: false,
  },
  [networkKeys.alphanet]: {
    name: networkKeys.alphanet,
    label: 'Alphanet',
    serviceUrl: 'https://alphanet-service.liskdev.net',
    wsServiceUrl: 'ws://alphanet-service.liskdev.net',
    isAvailable: false,
  },
  [networkKeys.betanet]: {
    name: networkKeys.betanet,
    label: 'Betanet',
    serviceUrl: 'http://betanet-service.lisk.com',
    wsServiceUrl: 'ws://betanet-service.lisk.com',
    isAvailable: true,
  },
  [networkKeys.devnet]: {
    name: networkKeys.devnet,
    label: 'Devnet',
    serviceUrl: 'http://devnet-service.liskdev.net:9901',
    wsServiceUrl: 'ws://devnet-service.liskdev.net:9901',
    isAvailable: false,
  },
  [networkKeys.testnet]: {
    name: networkKeys.testnet,
    label: 'Testnet',
    serviceUrl: 'http://testnet-service.lisk.com',
    wsServiceUrl: 'ws://testnet-service.lisk.com',
    isAvailable: false,
  },
  [networkKeys.customNode]: {
    name: networkKeys.devnet,
    label: 'Custom Service Node',
    serviceUrl: 'http://localhost:9901',
    wsServiceUrl: 'ws://localhost:9901',
    isAvailable: true,
  },
};

export default networks;
