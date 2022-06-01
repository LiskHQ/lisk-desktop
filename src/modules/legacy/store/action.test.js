import { create } from '@transaction/api';
import wallets from '@tests/constants/wallets';
import actionTypes from '@transaction/store/actionTypes';
import { balanceReclaimed } from './action';

jest.mock('@transaction/api/index');

describe('actions: legacy', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('balanceReclaimed', () => {
    const state = {
      wallet: {
        passphrase: wallets.non_migrated.passphrase,
        info: {
          LSK: wallets.non_migrated,
        },
      },
      network: {},
    };
    const getState = () => state;

    it('should dispatch transactionCreatedSuccess', async () => {
      const tx = { id: 1 };
      create.mockImplementation(() =>
        new Promise((resolve) => {
          resolve(tx);
        }));
      await balanceReclaimed({ fee: { value: '0,1' } })(dispatch, getState);

      expect(create).toHaveBeenCalledWith({
        network: state.network,
        wallet: state.wallet.info.LSK,
        transactionObject: {
          moduleAssetId: '1000:0',
          fee: 100000000,
          amount: '13600000000',
          keys: { numberOfSignatures: 0 },
        },
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.transactionCreatedSuccess,
        data: tx,
      });
    });

    it('should dispatch transactionSignError', async () => {
      const error = { message: 'TestError' };
      create.mockImplementation(() =>
        new Promise((_, reject) => {
          reject(error);
        }));
      await balanceReclaimed({ fee: { value: '0,1' } })(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.transactionSignError,
        data: error,
      });
    });
  });
});
