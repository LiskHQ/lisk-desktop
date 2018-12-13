import { getAccount } from './account';
import { getSingleTransaction } from './transactions';
import { listDelegates } from './delegate';
import regex from '../regex';

const filterAndOrderByMatch = (
  searchTerm, delegates,
) => [...delegates].filter(
  result => result.username.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0,
).sort((first, second) => {
  if (first.username < second.username) {
    return -1;
  } if (first.username > second.username) {
    return 1;
  }
  return 0;
});

/* eslint-disable prefer-promise-reject-errors */
const searchAddresses = (
  { liskAPIClient, searchTerm },
) => new Promise((resolve, reject) => getAccount(liskAPIClient, searchTerm)
  .then(response => resolve({ addresses: [response] }))
  .catch(() => reject({ addresses: [] })));

const searchDelegates = (
  { liskAPIClient, searchTerm },
) => new Promise(resolve => listDelegates(liskAPIClient, {
  search: searchTerm,
  sort: 'username:asc',
}).then((response) => {
  let delegatesSorted = filterAndOrderByMatch(searchTerm, response.data);
  if (delegatesSorted.length > 4) {
    delegatesSorted = delegatesSorted.slice(0, 4);
  }
  resolve({ delegates: delegatesSorted });
})
  .catch(() => resolve({ delegates: [] })));

const searchTransactions = (
  { liskAPIClient, searchTerm },
) => new Promise((resolve, reject) => getSingleTransaction({
  liskAPIClient,
  id: searchTerm,
}).then(response => resolve({ transactions: response.data }))
  .catch(() => reject({ transactions: [] })));

const getSearches = search => ([
  ...(search.match(regex.address)
    ? [searchAddresses] : [() => new Promise(resolve => resolve({ addresses: [] }))]),
  ...(search.match(regex.transactionId)
    ? [searchTransactions] : [() => new Promise(resolve => resolve({ transactions: [] }))]),
  searchDelegates, // allways add delegates promise as they share format (address, tx)
]);

const resolveAll = (liskAPIClient, apiCalls, searchTerm) => {
  const promises = apiCalls.map(apiCall => apiCall({ liskAPIClient, searchTerm })
    .catch(err => err));

  return new Promise((resolve, reject) => {
    Promise.all(promises)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};
/* eslint-enable prefer-promise-reject-errors */

const searchAll = ({ liskAPIClient, searchTerm }) => {
  const apiCalls = getSearches(searchTerm);
  return resolveAll(liskAPIClient, apiCalls, searchTerm);
};

export default searchAll;
