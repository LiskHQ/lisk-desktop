import Lisk from '@liskhq/lisk-client';
import actionTypes from '../constants/actions';
import txFilters from '../constants/transactionFilters';
import {
  getTransactions,
  transactionsUpdated,
} from './transactions';
import * as transactionsApi from '../utils/api/transaction';

jest.mock('../utils/api/transaction');
jest.mock('../utils/api/delegate');

describe.skip('actions: transactions', () => {
  const dispatch = jest.fn();
  const getState = () => ({
    network: {
      status: { online: true },
      name: 'Mainnet',
      networks: {
        LSK: {
          nodeUrl: 'hhtp://localhost:4000',
          nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
        },
      },
    },
    transactions: {
      filters: {
        direction: txFilters.all,
      },
    },
    settings: {
      token: {
        active: 'LSK',
      },
    },
    blocks: {
      latestBlocks: [{
        timestamp: Lisk.transaction.utils.getTimeFromBlockchainEpoch() - 12,
      }],
    },
  });

  describe('updateTransactions', () => {
    const data = {
      address: '15626650747375562521',
      limit: 20,
      offset: 0,
      filters: { direction: txFilters.all },
    };
    const actionFunction = transactionsUpdated(data);

    it('should dispatch updateTransactions action if resolved', async () => {
      transactionsApi.getTransactions.mockResolvedValue({ data: [], meta: { count: '0' } });
      const expectedAction = {
        count: 0,
        confirmed: [],
      };

      await actionFunction(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        data: expectedAction,
        type: actionTypes.updateTransactions,
      });
    });
  });

  describe('getTransactions', () => {
    const data = {
      address: '15626650747375562521L',
      limit: 20,
      offset: 0,
      filters: { direction: txFilters.all },
    };
    const actionFunction = getTransactions(data);

    it('should create an action function', () => {
      expect(typeof actionFunction).toBe('function');
    });

    it('should dispatch getTransactionsSuccess action if resolved', async () => {
      transactionsApi.getTransactions.mockResolvedValue({ data: [], meta: { count: '0' } });
      const expectedAction = {
        count: 0,
        confirmed: [],
        address: data.address,
        filters: data.filters,
      };

      await actionFunction(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        data: expectedAction, type: actionTypes.getTransactionsSuccess,
      });
    });
  });
});
