import { expect } from 'chai';
import sinon from 'sinon';
import actionTypes from '../constants/actions';
import txFilters from './../constants/transactionFilters';
import { sent, transactionsRequested, loadTransaction, transactionsUpdated } from './transactions';
import * as transactionsApi from '../utils/api/transactions';
import * as delegateApi from '../utils/api/delegate';
import accounts from '../../test/constants/accounts';
import Fees from '../constants/fees';
import networks from '../constants/networks';
import { toRawLsk } from '../utils/lsk';

describe('actions: transactions', () => {
  let getState = () => ({
    peers: { liskAPIClient: {} },
  });

  describe('transactionsUpdated', () => {
    let transactionsApiMock;
    const data = {
      address: '15626650747375562521',
      limit: 20,
      offset: 0,
      filter: txFilters.all,
    };
    const actionFunction = transactionsUpdated(data);
    let dispatch;

    beforeEach(() => {
      transactionsApiMock = sinon.stub(transactionsApi, 'getTransactions');
      dispatch = sinon.spy();
    });

    afterEach(() => {
      transactionsApiMock.restore();
    });

    it('should dispatch transactionsUpdated action if resolved', () => {
      transactionsApiMock.resolves({ data: [], meta: { count: '0' } });
      const expectedAction = {
        count: 0,
        confirmed: [],
      };

      actionFunction(dispatch, getState);
      expect(dispatch).to.have.been.calledWith({
        data: expectedAction,
        type: actionTypes.transactionsUpdated,
      });
    });
  });

  describe('transactionsRequested', () => {
    let transactionsApiMock;
    const data = {
      address: '15626650747375562521L',
      limit: 20,
      offset: 0,
      filter: txFilters.all,
    };
    const actionFunction = transactionsRequested(data);
    let dispatch;

    beforeEach(() => {
      transactionsApiMock = sinon.stub(transactionsApi, 'getTransactions');
      dispatch = sinon.spy();
    });

    afterEach(() => {
      transactionsApiMock.restore();
    });

    it('should create an action function', () => {
      expect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch transactionsLoaded action if resolved', () => {
      transactionsApiMock.resolves({ data: [], meta: { count: '0' } });
      const expectedAction = {
        count: 0,
        confirmed: [],
        address: data.address,
        filter: data.filter,
      };

      actionFunction(dispatch, getState);
      expect(dispatch).to.have.been
        .calledWith({ data: expectedAction, type: actionTypes.transactionsLoaded });
    });
  });

  describe('loadTransaction', () => {
    getState = () => ({
      peers: {
        liskAPIClient: {
          options: {
            name: networks.mainnet.name,
          },
        },
      },
    });
    let transactionApiMock;
    let delegateApiMock;
    const data = {
      address: '15626650747375562521',
      limit: 20,
      offset: 0,
      filter: txFilters.all,
    };
    const actionFunction = loadTransaction(data);
    let dispatch;

    beforeEach(() => {
      transactionApiMock = sinon.stub(transactionsApi, 'getSingleTransaction');
      delegateApiMock = sinon.stub(delegateApi, 'getDelegate');
      dispatch = sinon.spy();
      getState = () => ({
        peers: {
          liskAPIClient: {
            options: {
              name: 'Mainnet',
            },
          },
        },
      });
    });

    afterEach(() => {
      transactionApiMock.restore();
      delegateApiMock.restore();
    });

    it('should create an action function', () => {
      expect(typeof actionFunction).to.be.deep.equal('function');
    });
    // TODO: enable this when voting functionalities is fixed
    it.skip('should dispatch one transactionAddDelegateName action when transaction contains one vote added', () => {
      const delegateResponse = { delegate: { username: 'peterpan' } };
      const transactionResponse = {
        asset: {
          votes: [`+${accounts.delegate.publicKey}`],
        },
      };
      transactionApiMock.resolves({ data: [transactionResponse] });
      delegateApiMock.resolves({ data: delegateResponse });
      const expectedActionPayload = {
        ...delegateResponse,
        voteArrayName: 'added',
      };

      actionFunction(dispatch, getState);
      expect(dispatch).to.have.been
        .calledWith({ data: transactionResponse, type: actionTypes.transactionLoaded });
      expect(dispatch).to.have.been
        .calledWith({ data: expectedActionPayload, type: actionTypes.transactionAddDelegateName });
    });
    // TODO: enable this when voting functionalities is fixed
    it.skip('should dispatch one transactionAddDelegateName action when transaction contains one vote deleted', () => {
      const delegateResponse = { delegate: { username: 'peterpan' } };
      const transactionResponse = { transaction: { votes: { deleted: [accounts.delegate.publicKey] }, count: '0' } };
      transactionApiMock.resolves(transactionResponse);
      delegateApiMock.resolves(delegateResponse);
      const expectedActionPayload = {
        ...delegateResponse,
        voteArrayName: 'deleted',
      };

      actionFunction(dispatch, getState);
      expect(dispatch).to.have.been
        .calledWith({ data: transactionResponse, type: actionTypes.transactionLoaded });
      expect(dispatch).to.have.been
        .calledWith({ data: expectedActionPayload, type: actionTypes.transactionAddDelegateName });
    });
  });

  describe('sent', () => {
    getState = () => ({
      peers: { liskAPIClient: {} },
    });
    let transactionsApiMock;
    const data = {
      recipientId: '15833198055097037957L',
      amount: 100,
      passphrase: 'sample passphrase',
      secondPassphrase: null,
      account: {
        publicKey: 'test_public-key',
        address: 'test_address',
        loginType: 0,
      },
    };
    const actionFunction = sent(data);
    let dispatch;

    beforeEach(() => {
      transactionsApiMock = sinon.stub(transactionsApi, 'send');
      dispatch = sinon.spy();
      getState = () => ({
        peers: { liskAPIClient: {} },
      });
    });

    afterEach(() => {
      transactionsApiMock.restore();
    });

    it('should create an action function', () => {
      expect(typeof actionFunction).to.be.deep.equal('function');
    });

    it('should dispatch transactionAdded action if resolved', async () => {
      transactionsApiMock.resolves({ id: '15626650747375562521' });
      const expectedAction = {
        id: '15626650747375562521',
        senderPublicKey: 'test_public-key',
        senderId: 'test_address',
        recipientId: data.recipientId,
        amount: toRawLsk(data.amount),
        fee: Fees.send,
      };

      await actionFunction(dispatch, getState);
      expect(dispatch).to.have.been
        .calledWith({ data: expectedAction, type: actionTypes.transactionAdded });
    });

    it('should dispatch transactionFailed action if caught', async () => {
      transactionsApiMock.rejects({ message: 'sample message' });

      await actionFunction(dispatch, getState);
      const expectedAction = {
        data: {
          errorMessage: 'sample message.',
        },
        type: actionTypes.transactionFailed,
      };
      expect(dispatch).to.have.been.calledWith(expectedAction);
    });

    it('should dispatch transactionFailed action if caught but no message returned', async () => {
      const errorMessage = 'An error occurred while creating the transaction';
      transactionsApiMock.rejects({ message: errorMessage });

      await actionFunction(dispatch, getState);
      const expectedErrorMessage = errorMessage + '.'; // eslint-disable-line
      const expectedAction = {
        data: {
          errorMessage: expectedErrorMessage,
        },
        type: actionTypes.transactionFailed,
      };
      expect(dispatch).to.have.been.calledWith(expectedAction);
    });
  });


  // describe('accountLoggedOut', () => {
  //   it('should create an action to reset the account', () => {
  // });
});
