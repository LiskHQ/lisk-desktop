import getMappedFunction from './functionMapper';

// eslint-disable-next-line import/prefer-default-export
export const getAPIClient = (token, state) => (
  getMappedFunction(token, 'network', 'getAPIClient')(state.network)
);
