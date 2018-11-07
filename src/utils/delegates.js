
import localJSONStorage from './localJSONStorage';

export const updateDelegateCache = (delegates, networkCode) => {
  const savedDelegates = localJSONStorage.get(`delegateCache-${networkCode}`, {});
  const formatedDelegates = delegates
    .reduce((newDelegates, delegate) => {
      const delegateObj = { [delegate.username]: delegate.account };
      return Object.assign(newDelegates, delegateObj);
    }, {});
  const updatedDelegates = { ...formatedDelegates, ...savedDelegates };

  localJSONStorage.set(`delegateCache-${networkCode}`, updatedDelegates);
};

export const loadDelegateCache = networkCode =>
  localJSONStorage.get(`delegateCache-${networkCode}`, {});
