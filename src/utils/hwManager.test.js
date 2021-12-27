import { getAccountsFromDevice, signMessageByHW, signTransactionByHW } from './hwManager';
import * as accountApi from './api/account';
import accounts from '../../test/constants/accounts';
import * as communication from '../../libs/hwManager/communication';

jest.mock('../../libs/hwManager/communication', () => ({
  getPublicKey: jest.fn(),
  signTransaction: jest.fn(),
  signMessage: jest.fn(),
}));

jest.mock('./api/account', () => ({
  getAccount: jest.fn(),
}));

describe('hwManager util', () => {
  const signature = 'abc123ABC789';
  beforeEach(() => {
    communication.signTransaction.mockResolvedValueOnce(signature);
    communication.signMessage.mockResolvedValueOnce(signature);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccountsFromDevice', () => {
    it('should resolve all non-empty and one empty account', async () => {
      communication.getPublicKey.mockResolvedValueOnce(accounts.genesis.summary.publicKey);
      communication.getPublicKey.mockResolvedValueOnce(accounts.empty_account.summary.publicKey);
      accountApi.getAccount.mockResolvedValueOnce(accounts.genesis);
      accountApi.getAccount.mockResolvedValueOnce(accounts.empty_account);

      const device = { deviceId: '1234125125' };
      const network = { name: 'Testnet', networks: {} };

      const accountsOnDevice = await getAccountsFromDevice({ device, network });

      expect(accountsOnDevice).toEqual([accounts.genesis, accounts.empty_account]);
    });
  });

  describe('signTransactionByHW', () => {
    it('should return a transaction object with the proper signature', async () => {
      const account = {
        summary: {
          address: 'lskbgyrx3v76jxowgkgthu9yaf3dr29wqxbtxz8yp',
          publicKey: 'fd061b9146691f3c56504be051175d5b76d1b1d0179c5c4370e18534c5882122',
        },
        hwInfo: {
          deviceId: '060E803263E985C022CA2C9B',
          derivationIndex: 0,
        },
      };

      const transactionObject = {
        asset: {
          amount: '100000000',
          data: 'testing',
          recipientAddress: 'lskbgyrx3v76jxowgkgthu9yaf3dr29wqxbtxz8yp',
        },
        fee: '10000000',
        moduleID: 2,
        assetID: 0,
        nonce: '1',
        senderAddress: 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt',
      };

      const keys = {
        mandatoryKeys: [account.summary.publicKey],
        optionalKeys: [],
      };

      const networkIdentifier = Buffer.from('15f0dacc1060e91818224a94286b13aa04279c640bd5d6f193182031d133df7c', 'hex');
      const transactionBytes = Buffer.from('15f0dacc1060e91818224a94286b13aa04279c640bd5d6f193182031d133df7c', 'hex');

      const signedTransaction = await signTransactionByHW(
        account,
        networkIdentifier,
        transactionObject,
        transactionBytes,
        keys,
      );

      expect(signedTransaction.signatures[0]).toEqual(signature);
      expect(communication.signTransaction).toHaveBeenCalledWith({
        deviceId: account.hwInfo.deviceId,
        index: account.hwInfo.derivationIndex,
        networkIdentifier,
        transactionBytes,
      });
    });
  });

  describe('signMessageByHW', () => {
    it('should return a signature for given message', async () => {
      // Arrange
      const account = {
        hwInfo: {
          deviceId: '060E803263E985C022CA2C9B',
          derivationIndex: 0,
        },
      };
      const message = 'hello';

      // Act
      const signedMessage = await signMessageByHW({ account, message });

      // Assert
      expect(signedMessage).toEqual(signature);
      expect(communication.signMessage).toHaveBeenCalledWith({
        deviceId: account.hwInfo.deviceId,
        index: account.hwInfo.derivationIndex,
        message,
      });
    });
  });
});
