import { signTransaction } from '@transaction/api';
import wallets from '@tests/constants/wallets';
import { mockCommandParametersSchemas } from 'src/modules/common/__fixtures__';
import actionTypes from '@transaction/store/actionTypes';
import { balanceReclaimed } from './action';

jest.mock('@transaction/api/index');

describe('actions: legacy', () => {
  const dispatch = jest.fn();
  const moduleCommandSchemas = mockCommandParametersSchemas.data.commands.reduce(
    (result, { moduleCommand, schema }) => ({ ...result, [moduleCommand]: schema }),
    {}
  );
  const senderAccount = {
    mandatoryKeys: [],
    optionalKeys: [],
    publicKey: wallets.genesis.summary.publicKey,
  };
  const formProps = {
    isValid: true,
    moduleCommand: 'legacy:reclaimLSK',
  };

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
            nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
            moduleCommandSchemas,
          },
        },
      },
    };
    const getState = () => state;
    const transactionJSON = {
      sender: { publicKey: wallets.non_migrated.summary.publicKey },
      params: { amount: wallets.non_migrated.legacy.amount },
      fee: 100000,
      module: 'legacy',
      command: 'reclaim',
      moduleCommand: 'legacy:reclaimLSK',
    };
    const privateKey = '0x0';

    it('should dispatch transactionCreatedSuccess', async () => {
      const tx = { id: 1 };
      signTransaction.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolve(tx);
          })
      );
      await balanceReclaimed(
        formProps,
        transactionJSON,
        privateKey,
        '',
        senderAccount,
        moduleCommandSchemas
      )(dispatch, getState);

      expect(signTransaction).toHaveBeenCalledWith({
        transactionJSON,
        senderAccount,
        wallet: {
          ...state.wallet.info.LSK,
          hwInfo: undefined,
          loginType: undefined,
        },
        schema: moduleCommandSchemas[transactionJSON.moduleCommand],
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
      signTransaction.mockImplementation(
        () =>
          new Promise((_, reject) => {
            reject(error);
          })
      );
      await balanceReclaimed(
        formProps,
        transactionJSON,
        privateKey,
        '',
        senderAccount,
        moduleCommandSchemas
      )(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({
        type: actionTypes.transactionSignError,
        data: error,
      });
    });
  });
});
