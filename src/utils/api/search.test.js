import { expect } from 'chai';
import { stub } from 'sinon';
import searchAll from './search';
import * as peersAPI from './peers';

describe('Utils: Search', () => {
  let peersAPIStub;

  const accountsResponse = { account: { address: '1337L', balance: 1110, someOtherProperty: 'other property' } };
  const accountExpectedResponse = { account: { address: '1337L', balance: 1110 } };
  const accountsUrlParams = { address: '1337L' };
  const accountsUrlParamsTxMatch = { address: '1337' };

  const delegatesResponse = {
    delegates: [
      { username: '1337', rank: 18, address: '123456', someOtherProperty: 'other property' },
      { username: '1337l', rank: 19, address: '123456', someOtherProperty: 'other property' },
    ],
  };
  const delegatesExpectedResponse = {
    delegates: [
      { username: '1337', rank: 18, address: '123456' },
      { username: '1337l', rank: 19, address: '123456' },
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

  const transactionsResponse = { transaction: { id: '1337', height: 99, someOtherProperty: 'other property' } };
  const transactionsExpectedResponse = { transaction: { id: '1337', height: 99 } };
  const transactionsUrlParams = {
    id: '1337L',
  };
  const transactionsUrlParamsTxMatch = {
    id: '1337',
  };

  beforeEach(() => {
    peersAPIStub = stub(peersAPI, 'requestToActivePeer');
    // address match
    peersAPIStub.withArgs(undefined, 'accounts', accountsUrlParams).returnsPromise().resolves(accountsResponse);
    peersAPIStub.withArgs(undefined, 'delegates/search', delegatesUrlParams).returnsPromise().resolves(delegatesResponse);
    peersAPIStub.withArgs(undefined, 'transactions/get', transactionsUrlParams).returnsPromise().resolves(transactionsResponse);

    // txSearch match
    peersAPIStub.withArgs(undefined, 'accounts', accountsUrlParamsTxMatch).returnsPromise().resolves(accountsResponse);
    peersAPIStub.withArgs(undefined, 'delegates/search', delegatesUrlParamsTxMatch).returnsPromise().resolves(delegatesResponse);
    peersAPIStub.withArgs(undefined, 'transactions/get', transactionsUrlParamsTxMatch).returnsPromise().resolves(transactionsResponse);
  });

  afterEach(() => {
    peersAPIStub.restore();
  });

  it('should search {addresses,delegates} when only address pattern matched', () =>
    expect(searchAll({ search: '1337L' })).to.eventually.deep.equal([
      { addresses: [accountExpectedResponse.account] },
      { delegates: delegatesExpectedResponse.delegates },
    ]));

  it('should search {transactions,delegates} when only transaction pattern matched', () =>
    expect(searchAll({ search: '1337' })).to.eventually.deep.equal([
      { transactions: [transactionsExpectedResponse.transaction] },
      { delegates: delegatesExpectedResponse.delegates },
    ]));

  it('should still search for {addresses} when failing {delegates} request', () => {
    peersAPIStub.withArgs(undefined, 'delegates/search', delegatesUrlParams).returnsPromise().rejects({ success: false });
    return expect(searchAll({ search: '1337L' })).to.eventually.deep.equal([
      { addresses: [accountExpectedResponse.account] },
      { delegates: [] },
    ]);
  });

  it('should still search for {delegates} when failing {addresses} request', () => {
    peersAPIStub.withArgs(undefined, 'accounts', accountsUrlParams).returnsPromise().rejects({ success: false });
    return expect(searchAll({ search: '1337L' })).to.eventually.deep.equal([
      { addresses: [] },
      { delegates: delegatesExpectedResponse.delegates },
    ]);
  });

  it('should still search for {delegates} when failing {transactions} request', () => {
    peersAPIStub.withArgs(undefined, 'transactions/get', transactionsUrlParamsTxMatch).returnsPromise().rejects({ success: false });
    return expect(searchAll({ search: '1337' })).to.eventually.deep.equal([
      { transactions: [] },
      { delegates: delegatesExpectedResponse.delegates },
    ]);
  });
});
