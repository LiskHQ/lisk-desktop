import { expect } from 'chai';
import { stub } from 'sinon';
import { send, getTransactions, unconfirmedTransactions, getSingleTransaction } from './transactions';
import { getTimestampFromFirstBlock } from '../datetime';
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

    it('should call transactions.get with type', () => {
      const params = {
        liskAPIClient,
        address: '123L',
        filter: txFilters.incoming,
        type: 2,
      };

      getTransactions(params);

      const expected = {
        limit: 20,
        offset: 0,
        recipientId: '123L',
        sort: 'timestamp:desc',
        type: 2,
      };

      expect(liskAPIClient.transactions.get).to.have.been.calledWith(expected);
    });

    it('should call transactions.get with custom filters', () => {
      const params = {
        liskAPIClient,
        address: '123L',
        filter: txFilters.outgoing,
        customFilters: {
          message: 'test',
          dateTo: '16.12.16',
          dateFrom: '16.10.16',
        },
      };
      getTransactions(params);

      const expected = {
        limit: 20,
        offset: 0,
        senderId: '123L',
        sort: 'timestamp:desc',
        data: '%test%',
        fromTimestamp: getTimestampFromFirstBlock('16.10.16', 'DD.MM.YY'),
        toTimestamp: getTimestampFromFirstBlock('16.12.16', 'DD.MM.YY', { inclusive: true }),
      };

      expect(liskAPIClient.transactions.get).to.have.been.calledWith(expected);
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
