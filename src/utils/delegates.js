
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
  const formatedDelegates = delegates
    .reduce((newDelegates, delegate) => {
      const delegateObj = { [delegate.username]: delegate };
      return Object.assign(newDelegates, delegateObj);
    }, {});
  const updatedDelegates = { ...formatedDelegates, ...savedDelegates };

  localJSONStorage.set(getNetworkKey(network), updatedDelegates);
};

export const loadDelegateCache = network =>
  localJSONStorage.get(getNetworkKey(network), {});
