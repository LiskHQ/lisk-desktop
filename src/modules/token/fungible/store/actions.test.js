import loginTypes from '@auth/const/loginTypes';
import * as hwManager from '@transaction/utils/hwManager';
import { getState } from '@tests/fixtures/transactions';
import actionTypes from '@transaction/store/actionTypes';
import wallets from '@tests/constants/wallets';
import { getAddressFromBase32Address } from '@wallet/utils/account';
import { convertStringToBinary } from '@transaction/utils/transaction';
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
      const tx = {
        fee: BigInt(141000),
        moduleID: 2,
        assetID: 0,
        senderPublicKey: convertStringToBinary(wallets.genesis.summary.publicKey),
        nonce: BigInt(2),
        asset: {
          recipientAddress: getAddressFromBase32Address(wallets.genesis.summary.address),
          amount: BigInt(112300000),
          data: 'test',
        },
        signatures: expect.any(Array),
        id: expect.any(Object),
      };

      // Act
      await tokensTransferred(data)(dispatch, getState);
      const expectedAction = {
        type: actionTypes.transactionCreatedSuccess,
        data: tx,
      };

      // Assert
      expect(hwManager.signTransactionByHW).not.toHaveBeenCalled();
      // Replace toMatchSnapshot with a definitive assertion.
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch transactionSignError action if there are errors during transaction creation', async () => {
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
      const transactionError = new Error('The number NaN cannot be converted to a BigInt because it is not an integer');
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
