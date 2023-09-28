import loginTypes from '@auth/const/loginTypes';
import * as hwManager from '@transaction/utils/hwManager';
import { getState } from '@tests/fixtures/transactions';
import actionTypes from '@transaction/store/actionTypes';
import wallets from '@tests/constants/wallets';
import { convertStringToBinary } from '@transaction/utils/transaction';
import { MODULE_COMMANDS_NAME_MAP } from '@transaction/configuration/moduleCommand';
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

    // TODO: Unskip this test once SDK is updated to next alpha
    it.skip('should dispatch tokensTransferredSuccess action if there are no errors', async () => {
      // Arrange
      const data = {
        fee: 141000,
        moduleCommand: 'token:transfer',
        sender: {
          publicKey: wallets.genesis.summary.publicKey,
        },
        nonce: '2',
        params: {
          recipient: { address: wallets.genesis.summary.address },
          amount: 112300000,
          data: 'test',
        },
      };
      const tx = {
        fee: BigInt(141000),
        module: 'token',
        command: 'transfer',
        senderPublicKey: convertStringToBinary(wallets.genesis.summary.publicKey),
        nonce: BigInt(2),
        params: {
          recipientAddress: wallets.genesis.summary.address,
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
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it.skip('should dispatch transactionSignError action if there are errors during transaction creation', async () => {
      // Arrange
      const data = {
        fee: NaN,
        moduleCommand: 'token:transfer',
        sender: {
          publicKey: wallets.genesis.summary.publicKey,
        },
        nonce: '2',
        params: {
          recipientAddress: wallets.genesis.summary.address,
          amount: 112300000,
          data: 'test',
        },
      };
      const transactionError = new Error(
        'The number NaN cannot be converted to a BigInt because it is not an integer'
      );
      loginTypes.passphrase.code = 1;
      jest.spyOn(hwManager, 'signTransactionByHW').mockRejectedValue(transactionError);
      const expectedAction = {
        type: actionTypes.transactionSignError,
        data: transactionError,
      };

      const transactionJSON = {
        fee: BigInt(141000),
        module: 'token',
        command: 'transfer',
        senderPublicKey: convertStringToBinary(wallets.genesis.summary.publicKey),
        nonce: BigInt(2),
        params: {
          recipientAddress: wallets.genesis.summary.address,
          amount: BigInt(112300000),
          data: 'test',
        },
        signatures: expect.any(Array),
        id: expect.any(Object),
      };
      const privateKey = '';
      const senderAccount = {
        publicKey: wallets.genesis.summary.publicKey,
      };
      const moduleCommandSchemas = { [MODULE_COMMANDS_NAME_MAP.transfer]: '' };
      // Act
      await tokensTransferred(
        data,
        transactionJSON,
        privateKey,
        '',
        senderAccount,
        moduleCommandSchemas
      )(dispatch, getStateWithHW);
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });
});
