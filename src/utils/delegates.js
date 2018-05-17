
import localJSONStorage from './localJSONStorage';

export const updateDelegates = (delegates, network = 'mainet') => {
  const savedDelegates = localJSONStorage.get(network, {});
  const formatedDelegates = delegates.reduce((delegate, { address, publicKey, username }) => {
    delegate[address] = { publicKey, username };
    return delegate;
  }, {});
  const updatedDelegates = { ...formatedDelegates, ...savedDelegates };

  localJSONStorage.set(network, updatedDelegates);
};

export default updateDelegates;
