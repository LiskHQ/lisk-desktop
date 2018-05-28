import { requestToActivePeer } from './peers';
import regex from './../../utils/regex';

export const searchAddresses = ({ activePeer, search }) => new Promise((resolve, reject) =>
  requestToActivePeer(activePeer, 'accounts', {
    address: search,
  }).then(response => resolve({ addresses: [response.account] }))
    .catch(() => reject({ addresses: [] })));

export const searchDelegates = ({ activePeer, search }) => new Promise((resolve, reject) =>
  requestToActivePeer(activePeer, 'delegates/search', {
    q: search,
    orderBy: 'username:asc',
  }).then(response => resolve({ delegates: response.delegates }))
    .catch(() => reject({ delegates: [] })));

export const searchTransactions = ({ activePeer, search }) => new Promise((resolve, reject) =>
  requestToActivePeer(activePeer, 'transactions/get', {
    id: search,
  }).then(response => resolve({ transactions: [response.transaction] }))
    .catch(() => reject({ transactions: [] })));

export const getSearches = (search) => {
  let allSearches = [];
  allSearches = search.match(regex.address) ?
    [...allSearches, searchAddresses] :
    [...allSearches];
  allSearches = search.match(regex.transactionId) ?
    [...allSearches, searchTransactions] :
    [...allSearches];
  // allways add delegates promise as they share format (address, tx)
  allSearches = [...allSearches, searchDelegates];
  return allSearches;
};

export const resolveAll = (activePeer, apiCalls, search) => {
  const promises = apiCalls.map(apiCall =>
    apiCall({ activePeer, search })
      .catch(err => err));
  return new Promise((resolve, reject) => {
    Promise.all(promises)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

const searchAll = ({ activePeer, search }) => {
  const apiCalls = getSearches(search);
  return resolveAll(activePeer, apiCalls, search);
};

export default searchAll;
