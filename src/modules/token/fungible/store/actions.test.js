import loginTypes from 'src/modules/auth/const/loginTypes';
import * as hwManager from '@transaction/utils/hwManager';
import { getState } from '@tests/fixtures/transactions';
import actionTypes from '@transaction/store/actionTypes';
import wallets from '@tests/constants/wallets';
import { tokensTransferred } from './actions';

jest.mock('@transaction/utils/hwManager');

describe('actions: transactions', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const dispatch = jest.fn();

  describe('tokensTransferred', () => {
    const state = getState();

    const activeAccount = {
      ...state.wallet.info.LSK,
      hwInfo: {
        deviceModel: 'Ledger Nano S',
      },
      passphrase: state.wallet.passphrase,
    };
    const getStateWithHW = () => ({
      ...state,
      wallet: {
        info: {
          LSK: activeAccount,
        },
        hwInfo: {
          deviceModel: 'Ledger Nano S',
        },
        passphrase: state.wallet.passphrase,
      },
    });

    it('should dispatch tokensTransferredSuccess action if there are no errors', async () => {
      // Arrange
      const data = {
        fee: 141000,
        moduleAssetId: '2:0',
        sender: {
          publicKey: wallets.genesis.summary.publicKey,
        },
        nonce: '2',
        asset: {
          recipient: { address: wallets.genesis.summary.address },
          amount: 112300000,
          data: 'test',
        },
      };

      // Act
      await tokensTransferred(data)(dispatch, getState);

      // Assert
      expect(hwManager.signTransactionByHW).not.toHaveBeenCalled();
      // Replace toMatchSnapshot with a definitive assertion.
      expect(dispatch).toMatchSnapshot();
    });

    it.skip('should dispatch transactionSignError action if there are errors during transaction creation', async () => {
      // TODO: Fix this test
      // Arrange
      const data = {
        fee: NaN,
        moduleAssetId: '2:0',
        sender: {
          publicKey: wallets.genesis.summary.publicKey,
        },
        nonce: '2',
        asset: {
          recipient: { address: wallets.genesis.summary.address },
          amount: 112300000,
          data: 'test',
        },
      };
      const transactionError = new Error('Transaction create error');
      loginTypes.passphrase.code = 1;
      jest.spyOn(hwManager, 'signTransactionByHW')
        .mockRejectedValue(transactionError);
      const expectedAction = {
        type: actionTypes.transactionSignError,
        data: transactionError,
      };
      // Act
      await tokensTransferred(data)(dispatch, getStateWithHW);
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });
});
