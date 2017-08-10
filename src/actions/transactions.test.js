import { expect } from 'chai';
import actionTypes from '../constants/actions';
import { transactionAdded, transactionsUpdated, transactionsLoaded } from './transactions';

describe('actions: transactions', () => {
  const data = {
    id: 'dummy',
  };

  describe('transactionAdded', () => {
    it('should create an action to transactionAdded', () => {
      const expectedAction = {
        data,
        type: actionTypes.transactionAdded,
      };
      expect(transactionAdded(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('transactionsUpdated', () => {
    it('should create an action to transactionsUpdated', () => {
      const expectedAction = {
        data,
        type: actionTypes.transactionsUpdated,
      };
      expect(transactionsUpdated(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('errorToastDisplayed', () => {
    it('should create an action to transactionsLoaded', () => {
      const expectedAction = {
        data,
        type: actionTypes.transactionsLoaded,
      };
      expect(transactionsLoaded(data)).to.be.deep.equal(expectedAction);
    });
  });
});
