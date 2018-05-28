import { expect } from 'chai';
import { stub, match } from 'sinon';
import searchAll from './search';
import * as peersAPI from './peers';

describe.only('Utils: Search', () => {
  let peersAPIStub;

  const accountsResponse = { account: { address: '1337L' } };
  const accountsUrlParams = accountsResponse.account;

  const delegatesResponse = { delegates: [{ username: '1337', rank: 18 }, { username: '1337l', rank: 19 }] };
  const delegatesUrlParams = {
    q: '1337L',
    orderBy: 'username:asc',
  };

  const transactionsResponse = { transaction: { id: '1337' } };
  const transactionsUrlParams = {
    id: '1337',
  };

  beforeEach(() => {
    peersAPIStub = stub(peersAPI, 'requestToActivePeer');
    peersAPIStub.withArgs(match.any, 'accounts', accountsUrlParams).returnsPromise().resolves(accountsResponse);
    peersAPIStub.withArgs(match.any, 'delegaets/search', delegatesUrlParams).returnsPromise().resolves(delegatesResponse);
    peersAPIStub.withArgs(match.any, 'transactions/get', transactionsUrlParams).returnsPromise().resolves(transactionsResponse);
  });

  afterEach(() => {
    peersAPIStub.restore();
  });

  it('should return {addresses,delegates} promises when only address pattern matched', () => {
    return expect(searchAll({ search: '1337L' })).to.eventually.deep.equal([
      { addresses: [accountsResponse] },
      { delegates: delegatesResponse.delegates },
    ]);
  });

  it('should return {addresses,transactions,delegates} promises when only transaction pattern matched', () => {
    return expect(searchAll({ search: '1337' })).to.eventually.deep.equal([
      { addresses: [] },
      { transactions: [] },
      { delegates: [] },
    ]);
  });

  it.skip('should still return {delegates} promises when addresses request failure', () => {

    return expect(searchAPI.resolveAll([
      searchAPI.searchAddresses({}),
      searchAPI.searchDelegates({}),
      searchAPI.searchTransactions({}),
    ])).to.eventually.deep.equal([
      { addresses: undefined },
      { delegates: [] },
      { transactions: [] },
    ]);
  });

  it.skip('should still return {address,transactions} promises when delegates request failure', () => {
    searchDelegatesStub.returnsPromise().rejects({ delegates: undefined });

    return expect(searchAPI.resolveAll([
      searchAPI.searchAddresses({}),
      searchAPI.searchDelegates({}),
      searchAPI.searchTransactions({}),
    ])).to.eventually.deep.equal([
      { addresses: [] },
      { delegates: undefined },
      { transactions: [] },
    ]);
  });

  it.skip('should still return {address,delegates} promises when transactions request failure', () => {
    searchTransactionsStub.returnsPromise().rejects({ transactions: undefined });

    return expect(searchAPI.resolveAll([
      searchAPI.searchAddresses({}),
      searchAPI.searchDelegates({}),
      searchAPI.searchTransactions({}),
    ])).to.eventually.deep.equal([
      { addresses: [] },
      { delegates: [] },
      { transactions: undefined },
    ]);
  });
});
