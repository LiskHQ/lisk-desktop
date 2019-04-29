import { getTransactions, getSingleTransaction } from './transactions';
import { getTimestampFromFirstBlock } from '../../datetime';
import txFilters from '../../../constants/transactionFilters';
import { getAPIClient } from './network';

jest.mock('./network');

describe('Utils: Transactions API', () => {
  const address = '1212409187243L';
  let apiClient;
  const networkConfig = {};

  beforeEach(() => {
    apiClient = {
      transactions: {
        get: jest.fn(),
      },
      node: {
        getTransactions: jest.fn(),
      },
    };
    apiClient.node.getTransactions.mockResolvedValue({ data: [] });

    getAPIClient.mockReturnValue(apiClient);
  });

  describe('transactions', () => {
    it('should call transactions.get for incoming promise', () => {
      getTransactions({ networkConfig, address, filter: txFilters.incoming });

      expect(apiClient.transactions.get).toHaveBeenCalledWith(expect.objectContaining({
        recipientId: address,
      }));
    });

    it('should call transactions.get for outgoing promise', () => {
      getTransactions({ apiClient, address, filter: txFilters.outgoing });

      expect(apiClient.transactions.get).toHaveBeenCalledWith(expect.objectContaining({
        senderId: address,
      }));
    });

    it('should call transactions.get with type', () => {
      const params = {
        apiClient,
        address,
        filter: txFilters.incoming,
        type: 2,
      };

      getTransactions(params);

      const expected = {
        recipientId: address,
        type: 2,
      };

      expect(apiClient.transactions.get).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it('should call transactions.get with custom filters', () => {
      const params = {
        apiClient,
        address: '123L',
        filter: txFilters.outgoing,
        customFilters: {
          message: 'test',
          dateTo: '16.12.16',
          dateFrom: '16.10.16',
        },
      };
      getTransactions(params);

      const expected = {
        senderId: '123L',
        data: '%test%',
        fromTimestamp: getTimestampFromFirstBlock('16.10.16', 'DD.MM.YY'),
        toTimestamp: getTimestampFromFirstBlock('16.12.16', 'DD.MM.YY', { inclusive: true }),
      };

      expect(apiClient.transactions.get).toHaveBeenCalledWith(expect.objectContaining(expected));
    });
  });

  describe('getSingleTransaction', () => {
    const id = '124701289470';

    it('should apiClient.transactions.get and return a promise', () => {
      const promise = getSingleTransaction({ apiClient, id });
      expect(apiClient.transactions.get).toHaveBeenCalledWith({ id });
      expect(typeof promise.then).toEqual('function');
    });

    it('should apiClient.node.getTransactions if empty response', async () => {
      apiClient.transactions.get.mockResolvedValue({ data: [] });
      await getSingleTransaction({ apiClient, id });
      expect(apiClient.node.getTransactions).toHaveBeenCalledWith('unconfirmed', { id });
    });

    it('should reject if apiClient is undefined', async () => {
      expect(getSingleTransaction({ id })).rejects.toThrow('');
    });
  });
});
