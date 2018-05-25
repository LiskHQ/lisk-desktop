import { expect } from 'chai';
import { mock, stub } from 'sinon';
import * as searchAPI from './search';

describe.only('Utils: Search', () => {
  let searchAddressesStub;
  let searchDelegatesStub;
  let searchTransactionsStub;

  beforeEach(() => {
    searchAddressesStub = stub(searchAPI, 'searchAddress');
    searchDelegatesStub = stub(searchAPI, 'searchDelegate');
    searchTransactionsStub = stub(searchAPI, 'searchTransaction');
  });

  afterEach(() => {
    searchAddressesStub.restore();
    searchDelegatesStub.restore();
    searchTransactionsStub.restore();
  });

  describe('On all requests resolved', () => {
    beforeEach(() => {
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

  describe.skip('On some requests failed', () => {
    beforeEach(() => {
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
      searchAddressesStub.returnsPromise().rejects({ success: false });
      const promises = searchAPI.default({ activePeer: {}, search: '1337L' });
      return expect(promises).to.eventually.equal({
        accounts: { success: false },
        delegates: [],
      });
    });

    it('should still return {address,transactions} promises when delegates request failure', () => {
      searchDelegatesStub.returnsPromise().rejects({ success: false });
      const promises = searchAPI.default({ activePeer: {}, search: '1337L' });

      return expect(promises).to.eventually.equal({
        addresses: [],
        delegates: { success: false },
        transactions: [],
      });
    });
  });
});
