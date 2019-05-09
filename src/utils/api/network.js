import api from './';

// eslint-disable-next-line import/prefer-default-export
export const getAPIClient = (token, state) => (
  // TODO remove the localStorage condition after peers store is removed.
  localStorage.getItem('btc') ?
    api[token].network.getAPIClient(state.network) :
    /* istanbul ignore next */
    state.peers.liskAPIClient
);
