
import localJSONStorage from './localJSONStorage';

export const updateDelegateCache = (delegates, activePeer) => {
  const network = activePeer.currentNode;
  const savedDelegates = localJSONStorage.get(`delegateCache-${network}`, {});
  const formatedDelegates = delegates.reduce((delegate, { address, publicKey, username }) => {
    delegate[address] = { publicKey, username };
    return delegate;
  }, {});
  const updatedDelegates = { ...formatedDelegates, ...savedDelegates };

  localJSONStorage.set(`delegateCache-${network}`, updatedDelegates);
};

export const loadDelegateCache = (activePeer) => {
  const network = activePeer.currentNode;
  return localJSONStorage.get(`delegateCache-${network}`, {});
};
