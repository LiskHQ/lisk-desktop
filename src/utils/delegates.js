
import localJSONStorage from './localJSONStorage';

export const updateDelegateCache = (delegates, liskAPIClient) => {
  const network = liskAPIClient.currentNode;
  const savedDelegates = localJSONStorage.get(`delegateCache-${network}`, {});
  const formatedDelegates = delegates.reduce((delegate, { address, publicKey, username }) => {
    delegate[address] = { publicKey, username };
    return delegate;
  }, {});
  const updatedDelegates = { ...formatedDelegates, ...savedDelegates };

  localJSONStorage.set(`delegateCache-${network}`, updatedDelegates);
};

export const loadDelegateCache = (liskAPIClient) => {
  // TODO network just based on currentNode will not work well on Mainnet
  // because there are multiplercurrentNode options for Mainnet
  const network = liskAPIClient.currentNode;
  return localJSONStorage.get(`delegateCache-${network}`, {});
};
