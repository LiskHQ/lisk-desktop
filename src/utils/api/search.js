import requestToActivePeer from './peers';
import regex from './../../utils/regex';


export const searchAddress = ({ activePeer, search }) => new Promise((resolve, reject) => {
  resolve({ addresses: [] });
});
export const searchDelegate = ({ activePeer, search }) => new Promise((resolve, reject) => {
  resolve({ delegates: [] });
});
export const searchTransaction = ({ activePeer, search }) => new Promise((resolve, reject) => {
  resolve({ transactions: [] });
});

export const getSearches = (search) => {
  let allSearches = [];
  allSearches = search.match(regex.address) ?
    [...allSearches, searchAddress(search)] :
    [...allSearches];
  // if transaction match, we also add address promise, 
  // (not complete txId can also be a valid address search)
  allSearches = search.match(regex.transactionId) ?
    [...allSearches, searchAddress(search), searchTransaction(search)] :
    [...allSearches];
  // allways add delegates promise as they share format (address, tx)
  allSearches = [...allSearches, searchDelegate(search)];
  // eslint-disable-next-line no-confusing-arrow
  return allSearches;
};

const searchAll = ({ activePeer, search}) => {
  const promises = getSearches(search);
  return new Promise((resolve, reject) =>
    promises.map(promise =>
      promise.catch((error => error)
        .then(promiseResults => resolve(promiseResults))
        .catch(error => reject(error)),
      )));
};

export default searchAll;
