import Lisk from 'lisk-js';
import { activePeerSet, activePeerReset } from '../../actions/peers';

export const resetActivePeer = (store) => {
  store.dispatch(activePeerReset());
};

export const setActivePeer = (store, network) => {
  const addHttp = (url) => {
    const reg = /^(?:f|ht)tps?:\/\//i;
    return reg.test(url) ? url : `http://${url}`;
  };

  // this.network = network;
  let config = { };
  if (network) {
    config = network;
    if (network.address) {
      const normalizedUrl = new URL(addHttp(network.address));

      config.node = normalizedUrl.hostname;
      config.port = normalizedUrl.port;
      config.ssl = normalizedUrl.protocol === 'https';
    }
    if (config.testnet === undefined && config.port !== undefined) {
      config.testnet = config.port === '7000';
    }
  }

  return store.dispatch(activePeerSet(Lisk.api(config)));
};

export const requestToActivePeer = (activePeer, path, urlParams) =>
  new Promise((resolve, reject) => {
    activePeer.sendRequest(path, urlParams, (data) => {
      if (data.success) {
        resolve(data);
      } else {
        reject(data);
      }
    });
  });

