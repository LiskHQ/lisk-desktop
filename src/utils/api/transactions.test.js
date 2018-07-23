import { expect } from 'chai';
import { stub } from 'sinon';
import { send, getTransactions, unconfirmedTransactions } from './transactions';

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
  });

  describe('unconfirmedTransactions', () => {
    it('should return a promise', () => {
      const promise = unconfirmedTransactions(activePeer);
      expect(typeof promise.then).to.be.equal('function');
    });
  });
});
