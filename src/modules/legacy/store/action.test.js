import { createGenericTx } from '@transaction/api';
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
      token: { active: 'LSK' },
      network: {},
    };
    const getState = () => state;
    const transactionObject = {
      sender: { publicKey: wallets.non_migrated.summary.publicKey },
      params: { amount: wallets.non_migrated.legacy.amount },
      fee: 100000,
    };

    it('should dispatch transactionCreatedSuccess', async () => {
      const tx = { id: 1 };
      createGenericTx.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolve(tx);
          })
      );
      await balanceReclaimed(transactionObject)(dispatch, getState);

      expect(createGenericTx).toHaveBeenCalledWith({
        network: state.network,
        wallet: state.wallet.info.LSK,
        transactionObject,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.transactionCreatedSuccess,
        data: tx,
      });
    });

    it('should dispatch transactionSignError', async () => {
      const error = { message: 'TestError' };
      createGenericTx.mockImplementation(
        () =>
          new Promise((_, reject) => {
            reject(error);
          })
      );
      await balanceReclaimed(transactionObject)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.transactionSignError,
        data: error,
      });
    });
  });
});
