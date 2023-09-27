export const NETWORKS = {
  devnet: {
    name: 'devnet',
    serviceUrl: 'http://devnet-service.liskdev.net:9901',
  },
  local_network: {
    name: 'local_network',
    serviceUrl: 'http://localhost:9901',
  },
};

export const BASE_NETWORK = {
  name: NETWORKS.local_network.name,
  serviceUrl: NETWORKS.local_network.serviceUrl,
};
