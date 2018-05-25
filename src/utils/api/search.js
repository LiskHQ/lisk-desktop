import requestToActivePeer from './peers';
import regex from './../../utils/regex';


export const searchAddresses = ({ activePeer, search }) => new Promise((resolve, reject) => {
  resolve({ addresses: [] });
});
export const searchDelegates = ({ activePeer, search }) => new Promise((resolve, reject) => {
  resolve({ delegates: [] });
});
export const searchTransactions = ({ activePeer, search }) => new Promise((resolve, reject) => {
  resolve({ transactions: [] });
});

export const getSearches = (search) => {
  let allSearches = [];
  allSearches = search.match(regex.address) ?
    [...allSearches, searchAddresses(search)] :
    [...allSearches];
  // if transaction match, we also add address promise, 
  // (not complete txId can also be a valid address search)
  allSearches = search.match(regex.transactionId) ?
    [...allSearches, searchAddresses(search), searchTransactions(search)] :
    [...allSearches];
  // allways add delegates promise as they share format (address, tx)
  allSearches = [...allSearches, searchDelegates(search)];
  return allSearches;
};

export const resolveAll = (promises) => {
  const nonFailingPromises = promises.map((promise) => {
    const catchedPromise = promise.catch ?
      promise.catch(error => error) :
      promise;
    return catchedPromise;
  });

  return new Promise((resolve, reject) => {
    Promise.all(nonFailingPromises)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};


const searchAll = ({ activePeer, search}) => {
  const promises = getSearches(search);
  return resolveAll(promises);
};

export default searchAll;
