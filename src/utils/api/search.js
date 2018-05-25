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
  allSearches = search.match(regex.transactionId) ?
    [...allSearches, searchTransaction(search)] :
    [...allSearches];
  allSearches = [...allSearches, searchDelegate(search)];
  // eslint-disable-next-line no-confusing-arrow
  return allSearches;
};

const searchAll = ({ activePeer, search}) => {
  const promises = getSearches(search);
  let results = {};
  return promises.map(promise =>
    promise.then((response) => {
      results = { ...results, response };
      return results;
    }).catch((error) => {
      results = { ...results, error };
      return results;
    }),
  );
};

export default searchAll;
