import { setInStorage, getFromStorage } from './localJSONStorage';
import networks from '../constants/networks';
import { tokenMap } from '../constants/tokens';

const getNetworkKey = network => (
  `delegateCache-${
    network.name === networks.customNode.name
      ? network.networks[tokenMap.LSK.key].nodeUrl
      : network.name
  }`
);

export const updateDelegateCache = (delegates, network) => {
  getFromStorage(getNetworkKey(network), {}, (savedDelegates) => {
    setInStorage(getNetworkKey(network), {
      ...savedDelegates,
      ...delegates.reduce((newDelegates, delegate) => ({
        ...newDelegates,
        [delegate.username]: delegate,
        ...(delegate.account ? { [delegate.account.publicKey]: delegate } : {}),
      }), {}),
    });
  });
};

export const loadDelegateCache = (network, cb) =>
  getFromStorage(getNetworkKey(network), {}, cb);
