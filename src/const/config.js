export const METHOD = 'rest';
export const LIMIT = 20;
export const API_VERSION = 'v3';
export const MOCK_SERVICE_WORKER = process.env.REACT_APP_MSW;

export const DEFAULT_NETWORK =
  REACT_APP_DEFAULT_NETWORK !== 'undefined' ? REACT_APP_DEFAULT_NETWORK : 'testnet';
