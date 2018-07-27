import { expect } from 'chai';
import { stub } from 'sinon';
import { send, getTransactions, unconfirmedTransactions } from './transactions';
import txFilters from './../../constants/transactionFilters';

describe('Utils: Transactions API', () => {
  const activePeer = {
    transactions: {
      get: stub().returnsPromise(),
      broadcast: stub().returnsPromise(),
    },
    node: {
      getTransactions: stub().returnsPromise(),
    },
  };

  // TODO: fix these tests for assert more than just a promise is returned
  describe('send', () => {
    it('should return a promise', () => {
      const promise = send(activePeer);
      expect(typeof promise.then).to.be.equal('function');
    });
  });

  describe('transactions', () => {
    it('should return a promise', () => {
      const promise = getTransactions({ activePeer });
      expect(typeof promise.then).to.be.equal('function');
    });

    it('should call transactions.get for incoming promise', () => {
      getTransactions({ activePeer, address: '123L', filter: txFilters.incoming });

      expect(activePeer.transactions.get).to.have.been.calledWith({
        limit: 20, offset: 0, recipientId: '123L', sort: 'timestamp:desc',
      });
    });

    it('should call transactions.get for outgoing promise', () => {
      getTransactions({ activePeer, address: '123L', filter: txFilters.outgoing });

      expect(activePeer.transactions.get).to.have.been.calledWith({
        limit: 20, offset: 0, senderId: '123L', sort: 'timestamp:desc',
      });
    });
  });

  describe('unconfirmedTransactions', () => {
    it('should return a promise', () => {
      const promise = unconfirmedTransactions(activePeer);
      expect(typeof promise.then).to.be.equal('function');
    });
  });
});
