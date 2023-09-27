export const NETWORKS = {
  devnet: {
    name: 'devnet',
    serviceUrl: 'http://devnet-service.liskdev.net:9901',
  },
  customNode: {
    name: 'customNode',
    serviceUrl: 'http://127.0.0.1:9901',
  },
};

export const BASE_NETWORK = {
  ...NETWORKS.customNode,
};
