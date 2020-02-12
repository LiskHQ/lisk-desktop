import { to } from 'await-to-js';
import Lisk from '@liskhq/lisk-client-old';
import {
  send,
  getTransactions,
  getSingleTransaction,
  create,
  broadcast,
} from './transactions';
import accounts from '../../../../test/constants/accounts';
import networks from '../../../constants/networks';
import { getAPIClient } from './network';
import txFilters from '../../../constants/transactionFilters';
import transactionTypes from '../../../constants/transactionTypes';
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
    apiClient.transactions.get.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] });
    apiClient.node.getTransactions.mockResolvedValue({ data: [] });

    getAPIClient.mockReturnValue(apiClient);
  });

  // TODO: fix these tests for assert more than just a promise is returned
  describe('send', () => {
    it.skip('should broadcast a transaction and return a promise', async () => {
      await send(amount, {}, apiClient, accounts.genesis.passphrase, recipientId, null, 0);
      expect(apiClient.transactions.broadcast).toHaveBeenCalledWith(expect.objectContaining({
        amount,
        recipientId,
      }));
    });
  });

  describe('getTransactions', () => {
    it('should call transactions.get for incoming promise', () => {
      getTransactions({ networkConfig, address, filters: { direction: txFilters.incoming } });

      expect(apiClient.transactions.get).toHaveBeenCalledWith(expect.objectContaining({
        recipientId: address,
      }));
    });

    it('should call transactions.get for outgoing promise', () => {
      getTransactions({ apiClient, address, filters: { direction: txFilters.outgoing } });

      expect(apiClient.transactions.get).toHaveBeenCalledWith(expect.objectContaining({
        senderId: address,
      }));
    });

    it('should call transactions.get with type', () => {
      const params = {
        apiClient,
        address,
        filters: {
          direction: txFilters.incoming,
        },
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
        filters: {
          direction: txFilters.outgoing,
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
      expect(promise).toBeInstanceOf(Promise);
    });

    it('should apiClient.node.getTransactions if empty response', async () => {
      apiClient.transactions.get.mockResolvedValue({ data: [] });
      const [error] = await to(getSingleTransaction({ apiClient, id }));
      expect(apiClient.node.getTransactions).toHaveBeenCalledWith('ready', { id });
      expect(error).toEqual(new Error(`Transaction with id "${id}" not found`));
    });
  });

  describe('create', () => {
    it.skip('should create a transaction and return a promise', async () => {
      const tx = {
        amount: '1',
        data: { data: 'payment' },
        passphrase: 'abc',
        recipientId: '123L',
        secondPassphrase: null,
        timeOffset: 0,
      };
      const txResult = await create(tx, transactionTypes().send.key);
      expect(txResult.recipientId).toEqual(tx.recipientId);
      expect(txResult.amount).toEqual(tx.amount);
      expect(txResult.signature).not.toBeNull();
      expect(txResult.id).not.toBeNull();
      expect(txResult.senderPublicKey).not.toBeNull();
    });

    it('should fail for create a transaction and return a promise', async () => {
      Lisk.transaction.transfer = jest.fn();
      Lisk.transaction.transfer.mockImplementation(() => {
        throw new Error('sample error message');
      });
      const tx = {
        amount: '1',
        data: { data: 'payment' },
        passphrase: 'abc',
        recipientId: '123L',
        secondPassphrase: null,
        timeOffset: 0,
        network: {
          networks: {
            LSK: { networkIdentifier: 'sample_identifier' },
          },
        },
      };
      try {
        await create(tx, transactionTypes().send.key);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual('sample error message');
      }
      Lisk.transaction.transfer.mockRestore();
    });
  });

  describe('Broadcast', () => {
    it('should Broadcast a transaction and return a promise', async () => {
      const tx = {
        amount: '1',
        data: { data: 'payment' },
        passphrase: 'abc',
        recipientId: '123L',
        secondPassphrase: null,
        timeOffset: 0,
      };
      await broadcast(tx);
      expect(apiClient.transactions.broadcast).toHaveBeenCalledWith(expect.objectContaining(tx));
    });

    it('should fail Broadcast a transaction and return a promise', async () => {
      apiClient.transactions.broadcast.mockRejectedValue(new Error('sample error message'));
      const tx = {
        amount: '1',
        data: { data: 'payment' },
        passphrase: 'abc',
        recipientId: '123L',
        secondPassphrase: null,
        timeOffset: 0,
      };
      try {
        await broadcast(tx);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual('sample error message');
      }
    });
  });
});
