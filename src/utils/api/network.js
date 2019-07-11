import api from '.';

// eslint-disable-next-line import/prefer-default-export
export const getAPIClient = (token, state) => (
  api[token].network.getAPIClient(state.network)
);
