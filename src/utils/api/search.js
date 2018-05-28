import { requestToActivePeer } from './peers';
import regex from './../../utils/regex';


export const searchAddresses = ({ activePeer, search }) => new Promise((resolve, reject) => {

  console.log(activePeer, 'accounts', { address: search });
  requestToActivePeer(activePeer, 'accounts', { address: search })
    .then(response => resolve({ addresses: response.account }))
    .catch(() => reject({ addresses: undefined }));
});
export const searchDelegates = ({ activePeer, search }) => new Promise((resolve, reject) => {
  requestToActivePeer(activePeer, 'delegates/search', {
    q: search,
    orderBy: 'username:asc',
  }).then(response => resolve({ delegates: response.delegates }))
    .catch(() => reject({ delegates: undefined }));
});
export const searchTransactions = ({ activePeer, search }) => new Promise((resolve, reject) => {
  requestToActivePeer(activePeer, 'transactions/get', {
    id: search,
  }).then(response => resolve({ transactions: response.transaction }))
    .catch(() => reject({ transactions: undefined }));
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
