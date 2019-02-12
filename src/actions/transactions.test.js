import actionTypes from '../constants/actions';
import txFilters from './../constants/transactionFilters';
import { sent, transactionsRequested, loadTransaction, transactionsUpdated } from './transactions';
import * as transactionsApi from '../utils/api/transactions';
import * as delegateApi from '../utils/api/delegate';
import accounts from '../../test/constants/accounts';
import Fees from '../constants/fees';
import networks from '../constants/networks';
import { toRawLsk } from '../utils/lsk';

jest.mock('../utils/api/transactions');
jest.mock('../utils/api/delegate');

describe('actions: transactions', () => {
  const dispatch = jest.fn();
  let getState = () => ({
    peers: { liskAPIClient: {} },
  });

  describe('transactionsUpdated', () => {
    const data = {
      address: '15626650747375562521',
      limit: 20,
      offset: 0,
      filter: txFilters.all,
    };
    const actionFunction = transactionsUpdated(data);

    it('should dispatch transactionsUpdated action if resolved', async () => {
      transactionsApi.getTransactions.mockResolvedValue({ data: [], meta: { count: '0' } });
      const expectedAction = {
        count: 0,
        confirmed: [],
      };

      await actionFunction(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        data: expectedAction,
        type: actionTypes.transactionsUpdated,
      });
    });
  });

  describe('transactionsRequested', () => {
    const data = {
      address: '15626650747375562521L',
      limit: 20,
      offset: 0,
      filter: txFilters.all,
    };
    const actionFunction = transactionsRequested(data);

    it('should create an action function', () => {
      expect(typeof actionFunction).toBe('function');
    });

    it('should dispatch transactionsLoaded action if resolved', async () => {
      transactionsApi.getTransactions.mockResolvedValue({ data: [], meta: { count: '0' } });
      const expectedAction = {
        count: 0,
        confirmed: [],
        address: data.address,
        filter: data.filter,
      };

      await actionFunction(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        data: expectedAction, type: actionTypes.transactionsLoaded,
      });
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
    const data = {
      address: '15626650747375562521',
      limit: 20,
      offset: 0,
      filter: txFilters.all,
    };
    const actionFunction = loadTransaction(data);

    beforeEach(() => {
      getState = () => ({
        peers: {
          options: {
            code: 0,
          },
          liskAPIClient: {
            options: {
              name: 'Mainnet',
            },
          },
        },
      });
    });

    it('should create an action function', () => {
      expect(typeof actionFunction).toBe('function');
    });

    it('should dispatch one transactionAddDelegateName action when transaction contains one vote added', async () => {
      const transactionResponse = {
        asset: {
          votes: [`+${accounts.delegate.publicKey}`],
        },
      };
      const delegateResponse = { username: 'peterpan' };
      const expectedActionPayload = {
        delegate: delegateResponse,
        voteArrayName: 'added',
      };
      transactionsApi.getSingleTransaction.mockResolvedValue({ data: [transactionResponse] });
      delegateApi.getDelegate.mockResolvedValue({ data: [delegateResponse] });

      await actionFunction(dispatch, getState);
      await setTimeout(() => {}); // the timeout ensures that the async code inside `actionFunction ` is called before the next assertion
      expect(dispatch).toHaveBeenCalledWith({
        data: transactionResponse, type: actionTypes.transactionLoaded,
      });
      expect(dispatch).toHaveBeenCalledWith({
        data: expectedActionPayload, type: actionTypes.transactionAddDelegateName,
      });
    });

    it('should dispatch one transactionAddDelegateName action when transaction contains one vote deleted', async () => {
      const delegateResponse = { username: 'peterpan' };
      const transactionResponse = {
        asset: {
          votes: [`-${accounts.delegate.publicKey}`],
        },
      };
      transactionsApi.getSingleTransaction.mockResolvedValue({ data: [transactionResponse] });
      delegateApi.getDelegate.mockResolvedValue({ data: [delegateResponse] });
      const expectedActionPayload = {
        delegate: delegateResponse,
        voteArrayName: 'deleted',
      };

      await actionFunction(dispatch, getState);
      await setTimeout(() => {});
      expect(dispatch).toHaveBeenCalledWith({
        data: transactionResponse, type: actionTypes.transactionLoaded,
      });
      expect(dispatch).toHaveBeenCalledWith({
        data: expectedActionPayload, type: actionTypes.transactionAddDelegateName,
      });
    });
  });

  describe('sent', () => {
    getState = () => ({
      peers: { liskAPIClient: {} },
    });
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

    beforeEach(() => {
      getState = () => ({
        peers: { liskAPIClient: {} },
      });
    });

    it('should create an action function', () => {
      expect(typeof actionFunction).toBe('function');
    });

    it('should dispatch transactionAdded action if resolved', async () => {
      transactionsApi.send.mockResolvedValue({ id: '15626650747375562521' });
      const expectedAction = {
        id: '15626650747375562521',
        senderPublicKey: 'test_public-key',
        senderId: 'test_address',
        recipientId: data.recipientId,
        amount: toRawLsk(data.amount),
        fee: Fees.send,
        asset: { data: undefined },
        type: 0,
      };

      await actionFunction(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        data: expectedAction, type: actionTypes.transactionAdded,
      });
    });

    it('should dispatch transactionFailed action if caught', async () => {
      transactionsApi.send.mockRejectedValue({ message: 'sample message' });
      const expectedAction = {
        data: {
          errorMessage: 'sample message.',
        },
        type: actionTypes.transactionFailed,
      };

      await actionFunction(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch transactionFailed action if caught but no message returned', async () => {
      const errorMessage = 'An error occurred while creating the transaction';
      transactionsApi.send.mockRejectedValue({ message: errorMessage });
      const expectedErrorMessage = errorMessage + '.'; // eslint-disable-line
      const expectedAction = {
        data: {
          errorMessage: expectedErrorMessage,
        },
        type: actionTypes.transactionFailed,
      };

      await actionFunction(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });


  // describe('accountLoggedOut', () => {
  //   it('should create an action to reset the account', () => {
  // });
});
