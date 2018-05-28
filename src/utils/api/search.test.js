import { expect } from 'chai';
import { stub } from 'sinon';
import searchAll from './search';
import * as peersAPI from './peers';

describe.only('Utils: Search', () => {
  let peersAPIStub;

  const accountsResponse = { account: { address: '1337L' } };
  const accountsUrlParams = { address: '1337L' };
  const accountsUrlParamsTxMatch = { address: '1337' };

  const delegatesResponse = { delegates: [{ username: '1337', rank: 18 }, { username: '1337l', rank: 19 }] };
  const delegatesUrlParams = {
    q: '1337L',
    orderBy: 'username:asc',
  };
  const delegatesUrlParamsTxMatch = {
    q: '1337',
    orderBy: 'username:asc',
  };

  const transactionsResponse = { transaction: { id: '1337' } };
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

  it('should search {addresses,delegates} when only address pattern matched', () => {
    return expect(searchAll({ search: '1337L' })).to.eventually.deep.equal([
      { addresses: [accountsResponse.account] },
      { delegates: delegatesResponse.delegates },
    ]);
  });

  it('should search {transactions,delegates} when only transaction pattern matched', () => {
    return expect(searchAll({ search: '1337' })).to.eventually.deep.equal([
      { transactions: [transactionsResponse.transaction] },
      { delegates: delegatesResponse.delegates },
    ]);
  });

  it('should still search for {addresses} when failing {delegates} request', () => {
    peersAPIStub.withArgs(undefined, 'delegates/search', delegatesUrlParams).returnsPromise().rejects({ success: false });
    return expect(searchAll({ search: '1337L' })).to.eventually.deep.equal([
      { addresses: [accountsResponse.account] },
      { delegates: [] },
    ]);
  });

  it('should still search for {delegates} when failing {addresses} request', () => {
    peersAPIStub.withArgs(undefined, 'accounts', accountsUrlParams).returnsPromise().rejects({ success: false });
    return expect(searchAll({ search: '1337L' })).to.eventually.deep.equal([
      { addresses: [] },
      { delegates: delegatesResponse.delegates },
    ]);
  });

  it('should still search for {delegates} when failing {transactions} request', () => {
    peersAPIStub.withArgs(undefined, 'transactions/get', transactionsUrlParamsTxMatch).returnsPromise().rejects({ success: false });
    return expect(searchAll({ search: '1337' })).to.eventually.deep.equal([
      { transactions: [] },
      { delegates: delegatesResponse.delegates },
    ]);
  });
});
