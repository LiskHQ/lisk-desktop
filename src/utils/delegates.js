
import localJSONStorage from './localJSONStorage';
import networks from '../constants/networks';

const getNetworkKey = liskAPIClient => (
  `delegateCache-${
    liskAPIClient.options.code === networks.customNode.code ?
      liskAPIClient.currentNode :
      liskAPIClient.options.code
  }`
);

export const updateDelegateCache = (delegates, liskAPIClient) => {
  const savedDelegates = localJSONStorage.get(getNetworkKey(liskAPIClient), {});
  const formatedDelegates = delegates
    .reduce((newDelegates, delegate) => {
      const delegateObj = { [delegate.username]: delegate };
      return Object.assign(newDelegates, delegateObj);
    }, {});
  const updatedDelegates = { ...formatedDelegates, ...savedDelegates };

  localJSONStorage.set(getNetworkKey(liskAPIClient), updatedDelegates);
};

export const loadDelegateCache = liskAPIClient =>
  localJSONStorage.get(getNetworkKey(liskAPIClient), {});
