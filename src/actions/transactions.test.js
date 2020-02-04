import Lisk from '@liskhq/lisk-client-old';
import actionTypes from '../constants/actions';
import txFilters from '../constants/transactionFilters';
import {
  sent,
  getTransactions,
  updateTransactions,
} from './transactions';
import * as transactionsApi from '../utils/api/transactions';
import Fees from '../constants/fees';
import { toRawLsk } from '../utils/lsk';

jest.mock('../utils/api/transactions');
jest.mock('../utils/api/delegates');

describe('actions: transactions', () => {
  const dispatch = jest.fn();
  let getState = () => ({
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
    const actionFunction = updateTransactions(data);

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

  describe('sent', () => {
    const data = {
      recipientId: '15833198055097037957L',
      amount: 100,
      passphrase: 'sample passphrase',
      secondPassphrase: null,
      dynamicFeePerByte: null, // for BTC
      fee: null, // for BTC
      account: {
        info: {
          LSK: {
            publicKey: 'test_public-key',
            address: 'test_address',
          },
        },
        loginType: 0,
      },
      data: 'abc',
    };

    const actionFunction = sent(data);

    beforeEach(() => {
      getState = () => ({
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
        transactions: { filter: txFilters.all },
        settings: {
          token: {
            active: 'LSK',
          },
        },
        account: data.account,
        blocks: {
          latestBlocks: [{
            timestamp: Lisk.transaction.utils.getTimeFromBlockchainEpoch() - 12,
          }],
        },
      });
    });

    it('should create an action function', () => {
      expect(typeof actionFunction).toBe('function');
    });

    it('should dispatch addNewPendingTransaction action if resolved', async () => {
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
        token: 'LSK',
      };

      transactionsApi.create.mockReturnValue(expectedAction);
      transactionsApi.broadcast.mockReturnValue(expectedAction);

      await actionFunction(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        data: data.passphrase, type: actionTypes.passphraseUsed,
      });
    });

    it('should dispatch transactionFailed action if caught', async () => {
      transactionsApi.create.mockImplementation(() => {
        throw new Error('sample message');
      });

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
      transactionsApi.create.mockImplementation(() => {
        throw new Error(errorMessage);
      });

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
});
