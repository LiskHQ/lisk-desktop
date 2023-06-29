export const networkKeys = {
  mainnet: 'mainnet',
  alphanet: 'alphanet',
  betanet: 'betanet',
  devnet: 'devnet',
  testnet: 'testnet',
  customNode: 'customNode',
};

const networks = {
  [networkKeys.mainnet]: {
    name: networkKeys.mainnet,
    label: 'Mainnet',
    serviceUrl: 'https://mainnet-service.lisk.com',
    wsServiceUrl: 'wss://mainnet-service.lisk.com',
    isAvailable: false,
  },
  [networkKeys.alphanet]: {
    name: networkKeys.alphanet,
    label: 'Alphanet',
    serviceUrl: 'http://alphanet-service.liskdev.net',
    wsServiceUrl: 'ws://alphanet-service.liskdev.net',
    isAvailable: false,
  },
  [networkKeys.betanet]: {
    name: networkKeys.betanet,
    label: 'Betanet',
    serviceUrl: 'https://betanet-service.lisk.com',
    wsServiceUrl: 'wss://betanet-service.lisk.com',
    isAvailable: true,
  },
  [networkKeys.devnet]: {
    name: networkKeys.devnet,
    label: 'Devnet',
    serviceUrl: 'http://devnet-service.liskdev.net:9901',
    wsServiceUrl: 'ws://devnet-service.liskdev.net:9901',
    isAvailable: true,
  },
  [networkKeys.testnet]: {
    name: networkKeys.testnet,
    label: 'Testnet',
    serviceUrl: 'https://testnet-service.lisk.com',
    wsServiceUrl: 'wss://testnet-service.lisk.com',
    isAvailable: false,
  },
  [networkKeys.customNode]: {
    name: networkKeys.customNode,
    label: 'Custom Service Node',
    serviceUrl: 'http://localhost:9901',
    wsServiceUrl: 'ws://localhost:9901',
  },
};

export default networks;
