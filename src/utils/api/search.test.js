import { expect } from 'chai';
import { stub, mock, match } from 'sinon';
import searchAll from './search';
import * as peersAPI from './peers';

describe.only('Utils: Search', () => {
  let peersAPIStub;
  let activePeerMock;
  let activePeer = {
    getAccount: () => {},
  };

  const accountsResponse = { account: { address: '1337L', balance: 1110 }, success: true };
  const delegatesResponse = {
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

  const transactionsResponse = { transaction: { id: '1337', height: 99 } };
  const transactionsUrlParams = {
    id: '1337L',
  };
  const transactionsUrlParamsTxMatch = {
    id: '1337',
  };

  beforeEach(() => {
    peersAPIStub = stub(peersAPI, 'requestToActivePeer');
    activePeerMock = mock(activePeer);
    // address match
    activePeerMock.expects('getAccount').twice().withArgs('1337L').callsArgWith(1, accountsResponse);
    peersAPIStub.withArgs(undefined, 'delegates/search', delegatesUrlParams).returnsPromise().resolves(delegatesResponse);
    peersAPIStub.withArgs(undefined, 'transactions/get', transactionsUrlParams).returnsPromise().resolves(transactionsResponse);

    // txSearch match
    activePeerMock.expects('getAccount').withArgs('1337').callsArgWith(1, accountsResponse);
    peersAPIStub.withArgs(undefined, 'delegates/search', delegatesUrlParamsTxMatch).returnsPromise().resolves(delegatesResponse);
    peersAPIStub.withArgs(undefined, 'transactions/get', transactionsUrlParamsTxMatch).returnsPromise().resolves(transactionsResponse);
  });

  afterEach(() => {
    peersAPIStub.restore();
    activePeerMock.restore();
  });

  it.only('should search {addresses,delegates} when only address pattern matched', () => {
    searchAll({ activePeer, searchTerm: '1337L' }).then(response => console.log(response));
    return expect(searchAll({ activePeer, searchTerm: '1337L' })).to.eventually.deep.equal([
      { addresses: [accountsResponse.account] },
      { transactions: [] },
      { delegates: delegatesResponse.delegates },
    ]);
  });

  it('should search {transactions,delegates} when only transaction pattern matched', () =>
    expect(searchAll({ searchTerm: '1337' })).to.eventually.deep.equal([
      { addresses: [] },
      { transactions: [transactionsResponse.transaction] },
      { delegates: delegatesResponse.delegates },
    ]));

  it('should still search for {addresses} when failing {delegates} request', () => {
    peersAPIStub.withArgs(undefined, 'delegates/search', delegatesUrlParams).returnsPromise().rejects({ success: false });
    return expect(searchAll({ searchTerm: '1337L' })).to.eventually.deep.equal([
      { addresses: [accountsResponse.account] },
      { transactions: [] },
      { delegates: [] },
    ]);
  });

  it('should still search for {delegates} when failing {addresses} request', () => {
    return expect(searchAll({ searchTerm: '1337L' })).to.eventually.deep.equal([
      { addresses: [] },
      { transactions: [] },
      { delegates: delegatesResponse.delegates },
    ]);
  });

  it('should still search for {delegates} when failing {transactions} request', () => {
    peersAPIStub.withArgs(undefined, 'transactions/get', transactionsUrlParamsTxMatch).returnsPromise().rejects({ success: false });
    return expect(searchAll({ searchTerm: '1337' })).to.eventually.deep.equal([
      { addresses: [] },
      { transactions: [] },
      { delegates: delegatesResponse.delegates },
    ]);
  });
});
