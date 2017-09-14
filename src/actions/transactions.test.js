import { expect } from 'chai';
import sinon from 'sinon';
import actionTypes from '../constants/actions';
import { transactionAdded, transactionsUpdated,
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
      };

      actionFunction(dispatch);
      expect(dispatch).to.have.been.calledWith(transactionsLoaded(expectedAction));
    });
  });
});
