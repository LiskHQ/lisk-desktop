import { send, getTransactions, unconfirmedTransactions, getSingleTransaction } from './transactions';
import accounts from '../../../../test/constants/accounts';
import networks from '../../../constants/networks';
import { getAPIClient } from './network';
import txFilters from '../../../constants/transactionFilters';
import { getTimestampFromFirstBlock } from '../../datetime';

jest.mock('./network');

describe('Utils: Transactions API', () => {
  const id = '124701289470';
  const amount = '100000';
  const recipientId = '123L';
  const networkConfig = {
    name: networks.mainnet.name,
    networks: {
      LSK: {},
    },
  };
  let apiClient;
  const address = '1212409187243L';

  beforeEach(() => {
    apiClient = {
      transactions: {
        get: jest.fn(),
        broadcast: jest.fn(),
      },
      node: {
        getTransactions: jest.fn(),
      },
    };
    apiClient.transactions.broadcast.mockResolvedValue({ recipientId, amount, id });
    apiClient.node.getTransactions.mockResolvedValue({ data: [] });

    localStorage.setItem('btc', true); // TODO remove when enabling BTC

    getAPIClient.mockReturnValue(apiClient);
  });

  afterEach(() => {
    localStorage.removeItem('btc'); // TODO remove when enabling BTC
  });

  // TODO: fix these tests for assert more than just a promise is returned
  describe('send', () => {
    it('should broadcast a transaction and return a promise', async () => {
      await send(amount, {}, apiClient, accounts.genesis.passphrase, recipientId, null, 0);
      expect(apiClient.transactions.broadcast).toHaveBeenCalledWith(expect.objectContaining({
        amount,
        recipientId,
      }));
    });
  });

  describe('getTransactions', () => {
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

  describe('unconfirmedTransactions', () => {
    it('should return a promise', () => {
      const promise = unconfirmedTransactions(apiClient);
      expect(typeof promise.then).toEqual('function');
    });
  });
});
