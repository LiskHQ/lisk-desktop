import loginTypes from 'src/modules/auth/const/loginTypes';
import * as hwManager from '@transaction/utils/hwManager';
import { getState } from '@tests/fixtures/transactions';
import actionTypes from '@transaction/store/actionTypes';
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
        amount: '21000000',
        data: '',
        recipientAddress: 'lsky3t7xfxbcjf5xmskrbhkmwzxpowex6eubghtws',
        fee: 141000,
      };

      // Act
      await tokensTransferred(data)(dispatch, getState);

      // Assert
      expect(hwManager.signTransactionByHW).not.toHaveBeenCalled();
      // Replace toMatchSnapshot with a definitive assertion.
      expect(dispatch).toMatchSnapshot();
    });

    it('should dispatch transactionSignError action if there are errors during transaction creation', async () => {
      // Arrange
      const data = {
        amount: '21000000',
        data: '',
        recipientAddress: 'lsky3t7xfxbcjf5xmskrbhkmwzxpowex6eubghtws',
        fee: 141000,
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
