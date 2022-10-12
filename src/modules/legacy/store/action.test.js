import { createGenericTx } from '@transaction/api';
import wallets from '@tests/constants/wallets';
import moduleCommandSchemas from '@tests/constants/schemas';
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
        info: {
          LSK: wallets.non_migrated,
        },
      },
      token: { active: 'LSK' },
      network: {
        networks: {
          LSK: {
            serviceUrl: 'http://localhost:4000',
            nethash:
              '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
            moduleCommandSchemas,
          },
        }
      },
    };
    const getState = () => state;
    const transactionObject = {
      sender: { publicKey: wallets.non_migrated.summary.publicKey },
      params: { amount: wallets.non_migrated.legacy.amount },
      fee: 100000,
      module: 'legacy',
      command: 'reclaim',
      moduleCommand: 'legacy:reclaim',
    };
    const privateKey = '0x0';

    it('should dispatch transactionCreatedSuccess', async () => {
      const tx = { id: 1 };
      createGenericTx.mockImplementation(() =>
        new Promise((resolve) => {
          resolve(tx);
        }));
      await balanceReclaimed(transactionObject, privateKey)(dispatch, getState);

      expect(createGenericTx).toHaveBeenCalledWith({
        transactionObject,
        wallet: {
          ...state.wallet.info.LSK,
          hwInfo: undefined,
          loginType: undefined,
        },
        schema: state.network.networks.LSK.moduleCommandSchemas[transactionObject.moduleCommand],
        chainID: state.network.networks.LSK.chainID,
        privateKey,
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.transactionCreatedSuccess,
        data: tx,
      });
    });

    it('should dispatch transactionSignError', async () => {
      const error = { message: 'TestError' };
      createGenericTx.mockImplementation(() =>
        new Promise((_, reject) => {
          reject(error);
        }));
      await balanceReclaimed(transactionObject)(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.transactionSignError,
        data: error,
      });
    });
  });
});
