import * as communication from '@libs/hwManager/communication';
import * as accountApi from '@wallet/utilities/api';
import accounts from '@tests/constants/wallets';
import {
  getAccountsFromDevice,
  signMessageByHW,
  getNewAccountByIndex,
} from './index';

jest.mock('@libs/hwManager/communication', () => ({
  getPublicKey: jest.fn(),
  signTransaction: jest.fn(),
  signMessage: jest.fn(),
}));

jest.mock('@wallet/utilities/api', () => ({
  getAccounts: jest.fn(),
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
      accountApi.getAccounts.mockResolvedValueOnce({ data: [accounts.genesis] });

      const device = { deviceId: '1234125125' };
      const network = { name: 'Testnet', networks: {} };

      const accountsOnDevice = await getAccountsFromDevice({ device, network });

      expect(accountsOnDevice).toEqual([accounts.genesis]);
    });
  });

  describe('getNewAccountByIndex', () => {
    it('should resolve one empty account using a given index', async () => {
      communication.getPublicKey.mockResolvedValueOnce(accounts.genesis.summary.publicKey);

      const device = { deviceId: '1234125125' };

      const accountsOnDevice = await getNewAccountByIndex({ device, index: 11 });

      expect(accountsOnDevice).toEqual({
        summary: {
          publicKey: accounts.genesis.summary.publicKey,
          address: accounts.genesis.summary.address,
          balance: '0',
        },
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
