import localJSONStorage from './localJSONStorage';
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
  const savedDelegates = localJSONStorage.get(getNetworkKey(network), {});

  localJSONStorage.set(getNetworkKey(network), {
    ...savedDelegates,
    ...delegates.reduce((newDelegates, delegate) => ({
      ...newDelegates,
      [delegate.username]: delegate,
      ...(delegate.account ? { [delegate.account.publicKey]: delegate } : {}),
    }), {}),
  });
};

export const loadDelegateCache = network =>
  localJSONStorage.get(getNetworkKey(network), {});
