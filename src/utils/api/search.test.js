import { expect } from 'chai';
import { stub } from 'sinon';
import searchAll from './search';
import * as peersAPI from './peers';
import * as accountsAPI from './account';

describe('Utils: Search', () => {
  let peersAPIStub;
  let getAccountStub;

  const accountsResponse = { address: '1337L', balance: 1110 };

  const delegatesResponse = {
    delegates: [
      { username: '_1337l', rank: 19, address: '123456' },
      { username: '__1337ll', rank: 19, address: '123456' },
      { username: '1337', rank: 18, address: '123456' },
      { username: '1337l', rank: 18, address: '123456' },
      { username: '1337Lolo', rank: 18, address: '123456' },
    ],
  };
  const delegatesResponseOrdered = {
    delegates: [
      { username: '1337', rank: 18, address: '123456' },
      { username: '1337Lolo', rank: 18, address: '123456' },
      { username: '1337l', rank: 18, address: '123456' },
      { username: '__1337ll', rank: 19, address: '123456' },
    ],
  };

  const delegatesResponseOrderedAddressMatch = {
    delegates: [
      { username: '1337Lolo', rank: 18, address: '123456' },
      { username: '1337l', rank: 18, address: '123456' },
      { username: '1337', rank: 18, address: '123456' },
      { username: '__1337ll', rank: 19, address: '123456' },
    ],
  };
  const delegatesUrlParams = {
    q: '1337L',
    orderBy: 'username:asc',
  };
  const delegatesUrlParamsTxMatch = {
    q: '1337',
    orderBy: 'username:asc',
  };

  const transactionsResponse = { transaction: { id: '1337', height: 99 } };
  const transactionsUrlParams = {
    id: '1337L',
  };
  const transactionsUrlParamsTxMatch = {
    id: '1337',
  };

  beforeEach(() => {
    peersAPIStub = stub(peersAPI, 'requestToActivePeer');
    getAccountStub = stub(accountsAPI, 'getAccount');

    // address match
    getAccountStub.withArgs(undefined, '1337L').returnsPromise().resolves(accountsResponse);
    peersAPIStub.withArgs(undefined, 'delegates/search', delegatesUrlParams).returnsPromise().resolves(delegatesResponse);
    peersAPIStub.withArgs(undefined, 'transactions/get', transactionsUrlParams).returnsPromise().resolves(transactionsResponse);

    // txSearch match
    getAccountStub.withArgs(undefined, '1337').returnsPromise().resolves(accountsResponse);
    peersAPIStub.withArgs(undefined, 'delegates/search', delegatesUrlParamsTxMatch).returnsPromise().resolves(delegatesResponse);
    peersAPIStub.withArgs(undefined, 'transactions/get', transactionsUrlParamsTxMatch).returnsPromise().resolves(transactionsResponse);
  });

  afterEach(() => {
    peersAPIStub.restore();
    getAccountStub.restore();
  });

  it('should search {addresses,delegates} when only address pattern matched', () =>
    expect(searchAll({ searchTerm: '1337L' })).to.eventually.deep.equal([
      { addresses: [accountsResponse] },
      { transactions: [] },
      { delegates: delegatesResponseOrderedAddressMatch.delegates },
    ]));

  it('should search {transactions,delegates} when only transaction pattern matched', () =>
    expect(searchAll({ searchTerm: '1337' })).to.eventually.deep.equal([
      { addresses: [] },
      { transactions: [transactionsResponse.transaction] },
      { delegates: delegatesResponseOrdered.delegates },
    ]));

  it('should still search for {addresses} when failing {delegates} request', () => {
    peersAPIStub.withArgs(undefined, 'delegates/search', delegatesUrlParams).returnsPromise().rejects({ success: false });
    return expect(searchAll({ searchTerm: '1337L' })).to.eventually.deep.equal([
      { addresses: [accountsResponse] },
      { transactions: [] },
      { delegates: [] },
    ]);
  });

  it('should still search for {delegates} when failing {addresses} request', () => {
    getAccountStub.withArgs(undefined, '1337L').returnsPromise().rejects({ success: false });
    return expect(searchAll({ searchTerm: '1337L' })).to.eventually.deep.equal([
      { addresses: [] },
      { transactions: [] },
      { delegates: delegatesResponseOrderedAddressMatch.delegates },
    ]);
  });

  it('should still search for {delegates} when failing {transactions} request', () => {
    peersAPIStub.withArgs(undefined, 'transactions/get', transactionsUrlParamsTxMatch).returnsPromise().rejects({ success: false });
    return expect(searchAll({ searchTerm: '1337' })).to.eventually.deep.equal([
      { addresses: [] },
      { transactions: [] },
      { delegates: delegatesResponseOrdered.delegates },
    ]);
  });
});
