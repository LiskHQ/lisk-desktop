import api from '.';

// eslint-disable-next-line import/prefer-default-export
export const getAPIClient = (token, network) => (
  api[token].network.getAPIClient(network)
);
