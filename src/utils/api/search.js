import { getAccount, transaction } from './account';
import { listDelegates } from './delegate';
import regex from './../../utils/regex';

const orderDelegatesByMatch = (searchTerm, delegates) => [...delegates].sort((first, second) => {
  const regEx = new RegExp(`^${searchTerm}`, 'g');
  /* istanbul ignore next */
  if (first.username.match(regEx) && second.username.match(regEx)) {
    return first.username < second.username ? -1 : 1;
  } else if (!first.username.match(regEx)) {
    return 1;
  } else if (!second.username.match(regEx)) {
    return -1;
  }
  /* istanbul ignore next */
  return first.username < second.username ? -1 : 1;
});

/* eslint-disable prefer-promise-reject-errors */
const searchAddresses = ({ activePeer, searchTerm }) => new Promise((resolve, reject) =>
  getAccount(activePeer, searchTerm)
    .then(response => resolve({ addresses: [response] }))
    .catch(() => reject({ addresses: [] })));

const searchDelegates = ({ activePeer, searchTerm }) => new Promise((resolve, reject) =>
  listDelegates(activePeer, {
    q: searchTerm,
    orderBy: 'username:asc',
  }).then((response) => {
    let delegatesSorted = orderDelegatesByMatch(searchTerm, response.delegates);
    if (delegatesSorted.length > 4) {
      delegatesSorted = delegatesSorted.slice(0, 4);
    }
    resolve({ delegates: delegatesSorted });
  })
    .catch(() => reject({ delegates: [] })));

const searchTransactions = ({ activePeer, searchTerm }) => new Promise((resolve, reject) =>
  transaction({
    activePeer,
    id: searchTerm,
  }).then(response => resolve({ transactions: [response.transaction] }))
    .catch(() => reject({ transactions: [] })));

const getSearches = search => ([
  ...(search.match(regex.address) ?
    [searchAddresses] : [() => new Promise(resolve => resolve({ addresses: [] }))]),
  ...(search.match(regex.transactionId) ?
    [searchTransactions] : [() => new Promise(resolve => resolve({ transactions: [] }))]),
  searchDelegates, // allways add delegates promise as they share format (address, tx)
]);

const resolveAll = (activePeer, apiCalls, searchTerm) => {
  const promises = apiCalls.map(apiCall =>
    apiCall({ activePeer, searchTerm })
      .catch(err => err));

  return new Promise((resolve, reject) => {
    Promise.all(promises)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};
/* eslint-enable prefer-promise-reject-errors */

const searchAll = ({ activePeer, searchTerm }) => {
  const apiCalls = getSearches(searchTerm);
  return resolveAll(activePeer, apiCalls, searchTerm);
};

export default searchAll;
