
import localJSONStorage from './localJSONStorage';
import networks from '../constants/networks';

export const updateDelegateCache = (delegates, network = networks.mainnet.name) => {
  const savedDelegates = localJSONStorage.get(network, {});
  const formatedDelegates = delegates.reduce((delegate, { address, publicKey, username }) => {
    delegate[address] = { publicKey, username };
    return delegate;
  }, {});
  const updatedDelegates = { ...formatedDelegates, ...savedDelegates };

  localJSONStorage.set(network, updatedDelegates);
};

export const loadDelegateCache = (network = networks.mainnet.name) =>
  localJSONStorage.get(network, {});
