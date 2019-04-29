import { send, getTransactions, unconfirmedTransactions, getSingleTransaction } from './transactions';
import accounts from '../../../test/constants/accounts';
import networks from '../../constants/networks';
import { getAPIClient } from './lsk/network';

jest.mock('./lsk/network');

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
  let liskAPIClient;

  beforeEach(() => {
    liskAPIClient = {
      transactions: {
        get: jest.fn(),
        broadcast: jest.fn(),
      },
      node: {
        getTransactions: jest.fn(),
      },
    };
    liskAPIClient.transactions.broadcast.mockResolvedValue({ recipientId, amount, id });
    liskAPIClient.node.getTransactions.mockResolvedValue({ data: [] });

    localStorage.setItem('btc', true); // TODO remove when enabling BTC

    getAPIClient.mockReturnValue(liskAPIClient);
  });

  afterEach(() => {
    localStorage.removeItem('btc'); // TODO remove when enabling BTC
  });

  // TODO: fix these tests for assert more than just a promise is returned
  describe('send', () => {
    it('should broadcast a transaction and return a promise', () => {
      const promise = send(liskAPIClient, recipientId, amount, accounts.genesis.passphrase);
      expect(liskAPIClient.transactions.broadcast).toHaveBeenCalledWith(expect.objectContaining({
        amount,
        recipientId,
      }));
      expect(typeof promise.then).toEqual('function');
    });
  });

  describe('getTransactions', () => {
    it('should resolve getTransactions for specific token (BTC, LSK, ...) based on the address format ', async () => {
      const params = {
        address: recipientId,
        networkConfig,
      };
      liskAPIClient.transactions.get.mockResolvedValue({ data: [] });
      await getTransactions(params);
      expect(liskAPIClient.transactions.get).toHaveBeenCalledWith(expect.objectContaining({
        senderIdOrRecipientId: recipientId,
      }));
    });
  });

  describe('getSingleTransaction', () => {
    it('should resolve getSingleTransaction for specific token (BTC, LSK, ...) based on the address format ', async () => {
      const params = {
        id,
        networkConfig,
      };
      liskAPIClient.transactions.get.mockResolvedValue({ data: [] });
      await getSingleTransaction(params);
      expect(liskAPIClient.transactions.get).toHaveBeenCalledWith(expect.objectContaining({
        id,
      }));
    });
  });

  describe('unconfirmedTransactions', () => {
    it('should return a promise', () => {
      const promise = unconfirmedTransactions(liskAPIClient);
      expect(typeof promise.then).toEqual('function');
    });
  });
});
