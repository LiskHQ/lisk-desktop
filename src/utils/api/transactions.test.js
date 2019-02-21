import { expect } from 'chai';
import { stub } from 'sinon';
import { send, getTransactions, unconfirmedTransactions, getSingleTransaction } from './transactions';
import txFilters from './../../constants/transactionFilters';
import accounts from '../../../test/constants/accounts';

describe('Utils: Transactions API', () => {
  const id = '124701289470';
  const amount = '100000';
  const recipientId = '123L';
  const liskAPIClient = {
    transactions: {
      get: stub().returnsPromise(),
      broadcast: stub().returnsPromise().resolves({ recipientId, amount, id }),
    },
    node: {
      getTransactions: stub().returnsPromise(),
    },
  };

  // TODO: fix these tests for assert more than just a promise is returned
  describe('send', () => {
    it('should broadcast a transaction and return a promise', () => {
      const promise = send(liskAPIClient, recipientId, amount, accounts.genesis.passphrase);
      expect(liskAPIClient.transactions.broadcast).to.have.been.calledWith();
      expect(typeof promise.then).to.be.equal('function');
    });
  });

  describe('transactions', () => {
    it('should return a promise', () => {
      const promise = getTransactions({ liskAPIClient });
      expect(typeof promise.then).to.be.equal('function');
    });

    it('should call transactions.get for incoming promise', () => {
      getTransactions({ liskAPIClient, address: '123L', filter: txFilters.incoming });

      expect(liskAPIClient.transactions.get).to.have.been.calledWith({
        limit: 20, offset: 0, recipientId: '123L', sort: 'timestamp:desc',
      });
    });

    it('should call transactions.get for outgoing promise', () => {
      getTransactions({ liskAPIClient, address: '123L', filter: txFilters.outgoing });

      expect(liskAPIClient.transactions.get).to.have.been.calledWith({
        limit: 20, offset: 0, senderId: '123L', sort: 'timestamp:desc',
      });
    });

    it('should call transactions.get with custom filters', () => {
      const params = {
        liskAPIClient,
        address: '123L',
        filter: txFilters.outgoing,
        customFilters: {
          message: 'test',
          dateFrom: '01.01.18',
          dateTo: '01.02.18',
        },
      };
      getTransactions(params);

      expect(liskAPIClient.transactions.get).to.have.been.calledWith({
        limit: 20, offset: 0, senderId: '123L', sort: 'timestamp:desc', data: '%test%', fromTimestamp: 50659200, toTimestamp: 53337600,
      });
    });
  });

  describe('unconfirmedTransactions', () => {
    it('should return a promise', () => {
      const promise = unconfirmedTransactions(liskAPIClient);
      expect(typeof promise.then).to.be.equal('function');
    });
  });

  describe('getSingleTransaction', () => {
    it('should liskAPIClient.transactions.get and return a promise', () => {
      const promise = getSingleTransaction({ liskAPIClient, id });
      expect(liskAPIClient.transactions.get).to.have.been.calledWith({ id });
      expect(typeof promise.then).to.be.equal('function');
    });

    it('should liskAPIClient.node.getTransactions if empty response', () => {
      liskAPIClient.transactions.get = stub().returnsPromise().resolves({ data: [] });
      const promise = getSingleTransaction({ liskAPIClient, id });
      expect(liskAPIClient.node.getTransactions).to.have.been.calledWith('unconfirmed', { id });
      expect(typeof promise.then).to.be.equal('function');
    });
  });
});
