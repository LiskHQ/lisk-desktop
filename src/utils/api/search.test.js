import { expect } from 'chai';
import { stub } from 'sinon';
import searchAll from './search';
import * as accountsAPI from './account';
import * as transactionsAPI from './lsk/transactions';
import * as delegatesAPI from './delegates';

describe('Utils: Search', () => {
  let getAccountStub;
  let getDelegatesStub;
  let getSingleTransactionStub;
  const liskAPIClient = 'apiClientMock';

  const accountsResponse = { address: '1337L', balance: 1110 };

  const delegatesResponse = {
    data: [
      { username: '_1337l', rank: 19, account: { address: '123456' } },
      { username: '__1337ll', rank: 19, account: { address: '123456' } },
      { username: '1337', rank: 18, account: { address: '123456' } },
      { username: '1337l', rank: 18, account: { address: '123456' } },
      { username: '1337Lolo', rank: 18, account: { address: '123456' } },
    ],
  };
  const delegatesResponseOrdered = {
    delegates: [
      { username: '1337', rank: 18, account: { address: '123456' } },
      { username: '1337Lolo', rank: 18, account: { address: '123456' } },
      { username: '1337l', rank: 18, account: { address: '123456' } },
    ],
  };

  const delegatesResponseOrderedAddressMatch = {
    delegates: [
      { username: '1337Lolo', rank: 18, account: { address: '123456' } },
      { username: '1337l', rank: 18, account: { address: '123456' } },
    ],
  };
  const delegatesUrlParams = {
    search: '1337L',
    sort: 'username:asc',
  };
  const delegatesUrlParamsTxMatch = {
    search: '1337',
    sort: 'username:asc',
  };

  const transactionsResponse = { data: [{ id: '1337', height: 99 }] };

  beforeEach(() => {
    getAccountStub = stub(accountsAPI, 'getAccount');
    getDelegatesStub = stub(delegatesAPI, 'getDelegates');
    getSingleTransactionStub = stub(transactionsAPI, 'getSingleTransaction');

    // address match
    getAccountStub.withArgs({ liskAPIClient, address: '1337L' }).returnsPromise().resolves(accountsResponse);
    getDelegatesStub.withArgs(liskAPIClient, delegatesUrlParams)
      .returnsPromise().resolves(delegatesResponse);
    getSingleTransactionStub.returnsPromise().resolves(transactionsResponse);

    // txSearch match
    getAccountStub.withArgs({ liskAPIClient, address: '1337' }).returnsPromise().resolves(accountsResponse);
    getDelegatesStub.withArgs(liskAPIClient, delegatesUrlParamsTxMatch)
      .returnsPromise().resolves(delegatesResponse);
  });

  afterEach(() => {
    getDelegatesStub.restore();
    getSingleTransactionStub.restore();
    getAccountStub.restore();
  });

  it('should search {addresses,delegates} when only address pattern matched', () =>
    expect(searchAll(liskAPIClient, { searchTerm: '1337L' })).to.eventually.deep.equal({
      addresses: [accountsResponse],
      blocks: [],
      transactions: [],
      delegates: delegatesResponseOrderedAddressMatch.delegates,
    }));

  it('should search {transactions,delegates} when only transaction pattern matched', () =>
    expect(searchAll(liskAPIClient, { searchTerm: '1337' })).to.eventually.deep.equal({
      addresses: [],
      transactions: transactionsResponse.data,
      delegates: delegatesResponseOrdered.delegates,
    }));

  it('should still search for {addresses} when failing {delegates} request', () => {
    getDelegatesStub.withArgs(liskAPIClient, delegatesUrlParams)
      .returnsPromise().rejects({ success: false });
    return expect(searchAll(liskAPIClient, { searchTerm: '1337L' })).to.eventually.deep.equal({
      addresses: [accountsResponse],
      blocks: [],
      transactions: [],
      delegates: [],
    });
  });

  it('should still search for {delegates} when failing {addresses} request', async () => {
    getAccountStub.withArgs({ liskAPIClient, address: '1337L' }).returnsPromise().rejects({ success: false });
    const result = await searchAll(liskAPIClient, { searchTerm: '1337L' });
    expect(result).to.deep.equal({
      addresses: [],
      blocks: [],
      transactions: [],
      delegates: delegatesResponseOrderedAddressMatch.delegates,
    });
  });

  it('should still search for {delegates} when failing {transactions} request', () => {
    getSingleTransactionStub.returnsPromise().rejects({ success: false });
    return expect(searchAll(liskAPIClient, { searchTerm: '1337' })).to.eventually.deep.equal({
      addresses: [],
      transactions: [],
      delegates: delegatesResponseOrdered.delegates,
    });
  });
});
