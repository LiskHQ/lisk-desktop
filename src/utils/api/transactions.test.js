import { expect } from 'chai';
import { send, getTransactions, unconfirmedTransactions } from './transactions';

describe('Utils: Transactions API', () => {
  describe('send', () => {
    it('should return a promise', () => {
      const promise = send();
      expect(typeof promise.then).to.be.equal('function');
    });
  });

  describe('transactions', () => {
    it('should return a promise', () => {
      const promise = getTransactions({ activePeer: {} });
      expect(typeof promise.then).to.be.equal('function');
    });
  });

  describe('unconfirmedTransactions', () => {
    it('should return a promise', () => {
      const promise = unconfirmedTransactions();
      expect(typeof promise.then).to.be.equal('function');
    });
  });
});
