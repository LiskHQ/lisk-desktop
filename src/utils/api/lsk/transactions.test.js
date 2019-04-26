import { getTransactions } from './transactions';
import { getTimestampFromFirstBlock } from '../../datetime';
import txFilters from '../../../constants/transactionFilters';
import accounts from '../../../../test/constants/accounts';

describe('Utils: Transactions API', () => {
  const address = '1212409187243L';
  const apiClient = {
    transactions: {
      get: jest.fn(),
    },
  };

  describe('transactions', () => {
    it('should call transactions.get for incoming promise', () => {
      getTransactions({ apiClient, address, filter: txFilters.incoming });

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
        address: address,
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
});
