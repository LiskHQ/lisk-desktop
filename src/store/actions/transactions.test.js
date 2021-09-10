import { actionTypes } from '@constants';
import * as transactionsApi from '@api/transaction';
import * as awaitToJs from 'await-to-js';
import {
  emptyTransactionsData,
  transactionsRetrieved,
  resetTransactionResult,
  pendingTransactionAdded,
  transactionDoubleSigned,
  transactionBroadcasted,
} from './transactions';

jest.mock('@api/transaction');
jest.mock('@api/delegate');
// jest.mock('await-to-js')
// jest.spyOn(awaitToJs, 'to')
// const toMock = awaitToJs.to
transactionsApi.broadcast = jest.fn(() => {})

describe('actions: transactions', () => {
  const dispatch = jest.fn();
  const getState = () => ({
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
    it('should create an action to broadcast transaction', async () => {
      const data = {
        recipientAddress: 'lsktbdkqr8axg3rovndj997dveyrfctrpo95e9byc',
        amount: 149999992,
        fee: 0.001483953,
        dynamicFeePerByte: 0.000746375,
        reference: '',
        // id: 'a66c3cb626dbb631e53a5bd617cc8c13f06186c91f42e87008331e6dc4dc3cba',
        // signatures: ['ofh49fhfnYHK8499dvvn', '0egeJT7dgdnek4n5k6994k'],
        // senderPublicKey: 'MIICXAIBAAKBgQCqGKukO1De7zhZj6+H0qtjTkVxwTCpvKe4eCZ0FPqri0cb2JZfXJ/DgYSF6',
      }
      // toMock.mockResolvedValue(data)
      // awaitToJs.to = jest.fn.mockImplementation(() => Promise.resolve(data))
      // jest.spyOn(awaitToJs, 'to').mockImplementation(async () => data)
      jest.spyOn(awaitToJs, 'to').mockImplementation(async (new Promise(resolve => resolve({}))) => Promise.resolve(data))
      const expectedAction = {
        type: actionTypes.transactionBroadcasted,
        data,
      };
      // transactionsApi.broadcast.mockReturnValue({})
      // console.log(transactionBroadcasted(data))
      await transactionBroadcasted(data)(dispatch, getState)
      // expect(toMock).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });
});
