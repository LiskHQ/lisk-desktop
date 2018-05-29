import { requestToActivePeer } from './peers';
import regex from './../../utils/regex';

const reducers = {
  addresses: ['address', 'balance'],
  delegates: ['username', 'rank', 'address'],
  transactions: ['id', 'height'],
};
const reduceResponseProps = (response, key, reducerKeys) => {
  const reduced = response.map(result =>
    Object.keys(result)
      .filter(objKey => reducerKeys[key].includes(objKey))
      .reduce((obj, objKey) => {
        obj[objKey] = result[objKey];
        return obj;
      }, {}));
  return reduced;
};

export const searchAddresses = ({ activePeer, search }) => new Promise((resolve, reject) =>
  requestToActivePeer(activePeer, 'accounts', {
    address: search,
  }).then(response => resolve({ addresses: reduceResponseProps([response.account], 'addresses', reducers) }))
    .catch(() => reject({ addresses: [] })));

export const searchDelegates = ({ activePeer, search }) => new Promise((resolve, reject) =>
  requestToActivePeer(activePeer, 'delegates/search', {
    q: search,
    orderBy: 'username:asc',
  }).then(response => resolve({ delegates: reduceResponseProps(response.delegates, 'delegates', reducers) }))
    .catch(() => reject({ delegates: [] })));

export const searchTransactions = ({ activePeer, search }) => new Promise((resolve, reject) =>
  requestToActivePeer(activePeer, 'transactions/get', {
    id: search,
  }).then(response => resolve({ transactions: reduceResponseProps([response.transaction], 'transactions', reducers) }))
    .catch(() => reject({ transactions: [] })));

export const getSearches = search => ([
  ...(search.match(regex.address) ? [searchAddresses] : []),
  ...(search.match(regex.transactionId) ? [searchTransactions] : []),
  searchDelegates, // allways add delegates promise as they share format (address, tx)
]);

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
