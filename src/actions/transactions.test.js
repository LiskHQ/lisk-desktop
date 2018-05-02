import { expect } from 'chai';
import sinon from 'sinon';
import actionTypes from '../constants/actions';
import txFilters from './../constants/transactionFilters';
import { transactionAdded, transactionsUpdated, transactionFailed, transactionsRequested, loadTransaction } from './transactions';
import * as accountApi from '../utils/api/account';
import * as delegateApi from '../utils/api/delegate';

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

    it('should dispatch transactionsLoaded action if resolved', () => {
      accountApiMock.returnsPromise().resolves({ transactions: [], count: '0' });
      const expectedAction = {
        count: 0,
        confirmed: [],
        address: data.address,
        filter: data.filter,
      };

      actionFunction(dispatch);
      expect(dispatch).to.have.been
        .calledWith({ data: expectedAction, type: actionTypes.transactionsLoaded });
    });
  });

  describe('loadTransaction', () => {
    let accountApiMock;
    let delegateApiMock;
    const data = {
      activePeer: {},
      address: '15626650747375562521',
      limit: 20,
      offset: 0,
      filter: txFilters.all,
    };
    const actionFunction = loadTransaction(data);
    let dispatch;

    beforeEach(() => {
      accountApiMock = sinon.stub(accountApi, 'transaction');
      delegateApiMock = sinon.stub(delegateApi, 'getDelegate');
      dispatch = sinon.spy();
    });

    afterEach(() => {
      accountApiMock.restore();
      delegateApiMock.restore();
    });

    it('should create an action function', () => {
      expect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch one transactionAddDelegateName action when transaction contains one vote added', () => {
      const delegateResponse = { delegate: { username: 'peterpan' } };
      const transactionResponse = { transaction: { votes: { added: ['one'] }, count: '0' } };
      accountApiMock.returnsPromise().resolves(transactionResponse);
      delegateApiMock.returnsPromise().resolves(delegateResponse);
      const expectedActionPayload = {
        ...delegateResponse,
        voteArrayName: 'added',
      };

      actionFunction(dispatch);
      expect(dispatch).to.have.been
        .calledWith({ data: transactionResponse, type: actionTypes.transactionLoaded });
      expect(dispatch).to.have.been
        .calledWith({ data: expectedActionPayload, type: actionTypes.transactionAddDelegateName });
    });

    it('should dispatch one transactionAddDelegateName action when transaction contains one vote deleted', () => {
      const delegateResponse = { delegate: { username: 'peterpan' } };
      const transactionResponse = { transaction: { votes: { deleted: ['one'] }, count: '0' } };
      accountApiMock.returnsPromise().resolves(transactionResponse);
      delegateApiMock.returnsPromise().resolves(delegateResponse);
      const expectedActionPayload = {
        ...delegateResponse,
        voteArrayName: 'deleted',
      };

      actionFunction(dispatch);
      expect(dispatch).to.have.been
        .calledWith({ data: transactionResponse, type: actionTypes.transactionLoaded });
      expect(dispatch).to.have.been
        .calledWith({ data: expectedActionPayload, type: actionTypes.transactionAddDelegateName });
    });
  });
});
