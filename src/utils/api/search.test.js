import { expect } from 'chai';
import { stub } from 'sinon';
import * as searchAPI from './search';

describe('Utils: Search', () => {
  let searchAddressesStub;
  let searchDelegatesStub;
  let searchTransactionsStub;

  describe('On all requests resolved', () => {
    beforeEach(() => {
      searchAddressesStub = stub(searchAPI, 'searchAddresses');
      searchDelegatesStub = stub(searchAPI, 'searchDelegates');
      searchTransactionsStub = stub(searchAPI, 'searchTransactions');
      searchAddressesStub.returnsPromise().resolves({ addresses: [] });
      searchDelegatesStub.returnsPromise().resolves({ delegates: [] });
      searchTransactionsStub.returnsPromise().resolves({ transactions: [] });
    });

    afterEach(() => {
      searchAddressesStub.restore();
      searchDelegatesStub.restore();
      searchTransactionsStub.restore();
    });

    it('should return {addresses,delegates} promises when only address pattern matched', () => {
      const promises = searchAPI.getSearches('1337L');
      return expect(Promise.all(promises)).to.eventually.deep.equal([
        { addresses: [] },
        { delegates: [] },
      ]);
    });

    it('should return {addresses,transactions,delegates} promises when only transaction pattern matched', () => {
      const promises = searchAPI.getSearches('1337');
      return expect(Promise.all(promises)).to.eventually.deep.equal([
        { addresses: [] },
        { transactions: [] },
        { delegates: [] },
      ]);
    });
  });

  describe('On some requests failed', () => {
    beforeEach(() => {
      searchAddressesStub = stub(searchAPI, 'searchAddresses');
      searchDelegatesStub = stub(searchAPI, 'searchDelegates');
      searchTransactionsStub = stub(searchAPI, 'searchTransactions');
      searchAddressesStub.returnsPromise().resolves({ addresses: [] });
      searchDelegatesStub.returnsPromise().resolves({ delegates: [] });
      searchTransactionsStub.returnsPromise().resolves({ transactions: [] });
    });

    afterEach(() => {
      searchAddressesStub.restore();
      searchDelegatesStub.restore();
      searchTransactionsStub.restore();
    });

    it('should still return {delegates} promises when addresses request failure', () => {
      searchAddressesStub.returnsPromise().rejects({ addresses: undefined });

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

    it('should still return {address,transactions} promises when delegates request failure', () => {
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

    it('should still return {address,delegates} promises when transactions request failure', () => {
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
});
