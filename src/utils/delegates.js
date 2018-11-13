
import localJSONStorage from './localJSONStorage';
import networks from '../constants/networks';

const getNetworkKey = activePeer => (
  `delegateCache-${
    activePeer.options.code === networks.customNode.code ?
      activePeer.currentNode :
      activePeer.options.code
  }`
);

export const updateDelegateCache = (delegates, activePeer) => {
  const savedDelegates = localJSONStorage.get(getNetworkKey(activePeer), {});
  const formatedDelegates = delegates
    .reduce((newDelegates, delegate) => {
      const delegateObj = { [delegate.username]: delegate };
      return Object.assign(newDelegates, delegateObj);
    }, {});
  const updatedDelegates = { ...formatedDelegates, ...savedDelegates };

  localJSONStorage.set(getNetworkKey(activePeer), updatedDelegates);
};

export const loadDelegateCache = activePeer =>
  localJSONStorage.get(getNetworkKey(activePeer), {});
