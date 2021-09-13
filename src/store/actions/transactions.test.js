import { actionTypes } from '@constants';
import * as transactionsApi from '@api/transaction';
import {
  emptyTransactionsData,
  transactionsRetrieved,
  resetTransactionResult,
  pendingTransactionAdded,
  transactionDoubleSigned,
  transactionBroadcasted,
} from './transactions';
import { sampleTransaction } from '../../../test/constants/transactions';

jest.mock('@api/transaction');
jest.mock('@api/delegate');

describe('actions: transactions', () => {
  const dispatch = jest.fn();
  const getState = () => ({
    account: {
      passphrase: 'test',
      info: {
        LSK: {
          summary: { address: 'lsks6uckwnap7s72ov3edddwgxab5e89t6uy8gjt6' },
        },
        BTC: {
          summary: { address: '16Qp9op3fTESTBTCACCOUNTv52ghRzYreUuQ' },
        },
      },
    },
    network: {
      status: { online: true },
      name: 'Mainnet',
      networks: {
        LSK: {
          serviceUrl: 'http://localhost:4000',
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

  describe('emptyTransaction', () => {
    it('should create an action to empty transactions', () => {
      const expectedAction = { type: actionTypes.emptyTransactionsData };
      expect(emptyTransactionsData()).toEqual(expectedAction);
    });
  });

  describe('pendingTransactionAdded', () => {
    it('should create an action to add pending transaction', () => {
      const data = {
        moduleAssetId: '1938573839:g45krEIjwK',
        id: '4emF3me9YJSbcIuOp',
        fee: '0.001032519',
        nonce: 'wijFKdld1iRd039Bws24UR',
        signatures: ['xnVCm30IUhtYidgBX', 'uxsFGiaqS3n4ydB'],
        sender: {
          address: '3040783849904107057L',
          publicKey: 'MIICXAIBAAKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0FPqri0cb2JZfXJ/DgYSF6'
        },
        isPending: true,
      }
      const expectedAction = {
        type: actionTypes.pendingTransactionAdded,
        data,
      };
      expect(pendingTransactionAdded(data)).toEqual(expectedAction);
    });
  });

  describe('resetTransactionResult', () => {
    it('should create an action to reset transaction result', () => {
      const expectedAction = { type: actionTypes.resetTransactionResult };
      expect(resetTransactionResult()).toEqual(expectedAction);
    });
  });

  describe('transactionDoubleSigned', () => {
    it('should create an action to reset transaction result', () => {
      const data = {
        id: 'a66c3cb626dbb631e53a5bd617cc8c13f06186c91f42e87008331e6dc4dc3cba',
        signatures: ['ofh49fhfnYHK8499dvvn', '0egeJT7dgdnek4n5k6994k'],
        senderPublicKey: 'MIICXAIBAAKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0FPqri0cb2JZfXJ/DgYSF6',
      }
      const expectedAction = {
        type: actionTypes.transactionDoubleSigned,
        data
      };
      expect(transactionDoubleSigned(data)).toEqual(expectedAction);
    });
  });

  describe('transactionBroadcasted', () => {
    it('should create an action to broadcast transaction successfully', async () => {
      transactionsApi.broadcast.mockResolvedValue({data: sampleTransaction})

      const expectedAction = {
        type: actionTypes.broadcastedTransactionSuccess,
        data: sampleTransaction,
      };

      await transactionBroadcasted(sampleTransaction)(dispatch, getState)
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
      expect(transactionsApi.broadcast).toHaveBeenCalled()
    });
  });
});
