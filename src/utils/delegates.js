
import localJSONStorage from './localJSONStorage';

export const updateDelegateCache = (delegates, activePeer) => {
  const network = activePeer.options.address || activePeer.options.name;
  const savedDelegates = localJSONStorage.get(network, {});
  const formatedDelegates = delegates.reduce((delegate, { address, publicKey, username }) => {
    delegate[address] = { publicKey, username };
    return delegate;
  }, {});
  const updatedDelegates = { ...formatedDelegates, ...savedDelegates };

  localJSONStorage.set(`delegateCache-${network}`, updatedDelegates);
};

export const loadDelegateCache = (activePeer) => {
  const network = activePeer.options.address || activePeer.options.name;
  return localJSONStorage.get(`delegateCache-${network}`, {});
};
