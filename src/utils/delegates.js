
import localJSONStorage from './localJSONStorage';

export const updateDelegateCache = (delegates, activePeer) => {
  const network = activePeer.currentNode;
  const savedDelegates = localJSONStorage.get(`delegateCache-${network}`, {});
  const formatedDelegates = delegates
    .reduce((newDelegates, { account, publicKey, username }) => {
      const delegate = { [account.address]: { publicKey, username } };
      return Object.assign(newDelegates, delegate);
    }, {});
  const updatedDelegates = { ...formatedDelegates, ...savedDelegates };

  localJSONStorage.set(`delegateCache-${network}`, updatedDelegates);
};

export const loadDelegateCache = (activePeer) => {
  // TODO network just based on currentNode will not work well on Mainnet
  // because there are multiplercurrentNode options for Mainnet
  const network = activePeer.currentNode;
  return localJSONStorage.get(`delegateCache-${network}`, {});
};
