import { actionTypes } from '@constants';
import * as transactionsApi from '@api/transaction';
import to from 'await-to-js';
import {
  transactionsRetrieved,
  transactionBroadcasted,
} from './transactions';
import {
  accountDataUpdated,
} from './account';

jest.mock('@api/transaction');
jest.mock('@api/delegate');
jest.mock('await-to-js');
jest.mock('./account', () => ({
  accountDataUpdated: jest.fn(),
}));

describe('actions: transactions', () => {
  const dispatch = jest.fn();
  const getState = () => ({
    network: {
      status: { online: true },
      name: 'Mainnet',
      networks: {
        LSK: {
          serviceUrl: 'hhtp://localhost:4000',
          nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
        },
      },
    },
    transactions: {
      filters: {},
    },
    settings: {
      token: {
        active: 'LSK',
      },
    },
    blocks: {
      latestBlocks: [{
        timestamp: 123123123,
      }],
    },
  });

  describe('getTransactions', () => {
    const data = {
      address: '15626650747375562521L',
      limit: 20,
      offset: 0,
      filters: {},
    };

    it('should create an action function', () => {
      expect(typeof transactionsRetrieved(data)).toBe('function');
    });

    it('should dispatch getTransactionsSuccess action if resolved', async () => {
      transactionsApi.getTransactions.mockResolvedValue({ data: [], meta: { total: 0 } });
      const expectedAction = {
        count: 0,
        confirmed: [],
        address: data.address,
        filters: data.filters,
        offset: 0,
      };

      await transactionsRetrieved(data)(dispatch, getState);
      expect(dispatch).toHaveBeenLastCalledWith({
        type: actionTypes.transactionsRetrieved,
        data: expectedAction,
      });
    });
  });

  describe('broadcastTransaction', () => {
    it('should dispatch accountDataUpdated when broadcast transaction fails because of invalid nonce', async () => {
      const error = { message: 'nonce is lower than account nonce' };
      to.mockImplementation(() => (
        [error]
      ));

      await transactionBroadcasted()(dispatch, getState);
      expect(accountDataUpdated).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenLastCalledWith({
        type: actionTypes.broadcastedTransactionError,
        data: {
          error,
        },
      });
    });
  });
});
