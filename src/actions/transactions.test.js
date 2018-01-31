import { expect } from 'chai';
import sinon from 'sinon';
import actionTypes from '../constants/actions';
import txFilters from './../constants/transactionFilters';
import { transactionAdded, transactionsUpdated, transactionFailed, transactionsFailed,
  transactionsLoaded, transactionsRequested } from './transactions';
import * as accountApi from '../utils/api/account';

describe('actions: transactions', () => {
  describe('transactionAdded', () => {
    it('should create an action to transactionAdded', () => {
      const data = {
        id: 'dummy',
      };
      const expectedAction = {
        data,
        type: actionTypes.transactionAdded,
      };

      expect(transactionAdded(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('transactionFailed', () => {
    it('should create an action to transactionFailed', () => {
      const errorMessage = 'Your transaction failed';
      const expectedAction = {
        data: { errorMessage },
        type: actionTypes.transactionFailed,
      };

      expect(transactionFailed({ errorMessage })).to.be.deep.equal(expectedAction);
    });
  });

  describe('transactionsFailed', () => {
    it('should create an action to transactionsFailed', () => {
      const data = {
        id: 'dummy',
      };
      const expectedAction = {
        data,
        type: actionTypes.transactionsFailed,
      };

      expect(transactionsFailed(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('transactionsUpdated', () => {
    it('should create an action to transactionsUpdated', () => {
      const data = {
        id: 'dummy',
      };
      const expectedAction = {
        data,
        type: actionTypes.transactionsUpdated,
      };

      expect(transactionsUpdated(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('transactionsLoaded', () => {
    it('should create an action to transactionsLoaded', () => {
      const data = {
        id: 'dummy',
      };
      const expectedAction = {
        data,
        type: actionTypes.transactionsLoaded,
      };

      expect(transactionsLoaded(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('transactionsRequested', () => {
    let accountApiMock;
    const data = {
      activePeer: {},
      address: '15626650747375562521',
      limit: 20,
      offset: 0,
      filter: txFilters.all,
    };
    const actionFunction = transactionsRequested(data);
    let dispatch;

    beforeEach(() => {
      accountApiMock = sinon.stub(accountApi, 'transactions');
      dispatch = sinon.spy();
    });

    afterEach(() => {
      accountApiMock.restore();
    });

    it('should create an action function', () => {
      expect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch transactionAdded action if resolved', () => {
      accountApiMock.returnsPromise().resolves({ transactions: [], count: '0' });
      const expectedAction = {
        count: 0,
        confirmed: [],
        address: data.address,
        filter: data.filter,
      };

      actionFunction(dispatch);
      expect(dispatch).to.have.been.calledWith(transactionsLoaded(expectedAction));
    });
  });
});
