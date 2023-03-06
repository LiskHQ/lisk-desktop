import { cryptography } from '@liskhq/lisk-client';
import * as communication from '@libs/hwServer/communication';
import * as accountApi from '@wallet/utils/api';
import wallets from '@tests/constants/wallets';
import hwManager from 'src/modules/hardwareWallet/manager/HWManager';
import { getAccountsFromDevice, signMessageByHW, getNewAccountByIndex } from './hwManager';

const address = 'lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt';

jest.mock('@libs/hwServer/communication', () => ({
  getPublicKey: jest.fn(),
  signTransaction: jest.fn(),
  signMessage: jest.fn(),
}));

jest.mock('@wallet/utils/api', () => ({
  getAccounts: jest.fn(),
  getUsedHWAccounts: jest.fn(),
}));

jest.spyOn(cryptography.address, 'getLisk32AddressFromPublicKey').mockReturnValue(address);

describe('hwManager util', () => {
  const signature = 'abc123ABC789';
  jest.spyOn(hwManager, 'getPublicKey').mockReturnValue(wallets.genesis.summary.publicKey);
  jest.spyOn(hwManager, 'signMessage').mockReturnValue(signature);

  beforeEach(() => {
    communication.signTransaction.mockResolvedValueOnce(signature);
    communication.signMessage.mockResolvedValueOnce(signature);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe.skip('getAccountsFromDevice', () => {
    it('should resolve all non-empty and one empty account', async () => {
      communication.getPublicKey.mockResolvedValueOnce(wallets.genesis.summary.publicKey);
      communication.getPublicKey.mockResolvedValueOnce(wallets.empty_wallet.summary.publicKey);
      accountApi.getAccounts.mockResolvedValueOnce({ data: [wallets.genesis] });

      const device = { deviceId: '1234125125' };
      const network = { name: 'Testnet', networks: {} };

      const walletsOnDevice = await getAccountsFromDevice({ device, network });

      expect(walletsOnDevice).toEqual([wallets.genesis]);
    });
  });

  describe('getNewAccountByIndex', () => {
    it('should resolve one empty account using a given index', async () => {
      const device = { deviceId: '1234125125' };

      const walletsOnDevice = await getNewAccountByIndex({ device, index: 11 });

      expect(walletsOnDevice).toEqual({
        summary: {
          publicKey: wallets.genesis.summary.publicKey,
          address: wallets.genesis.summary.address,
          balance: '0',
        },
      });
    });
  });

  describe('signMessageByHW', () => {
    it('should return a signature for given message', async () => {
      // Arrange
      const wallet = {
        hwInfo: {
          deviceId: '060E803263E985C022CA2C9B',
          derivationIndex: 0,
        },
      };
      const message = 'hello';

      // Act
      const signedMessage = await signMessageByHW({ wallet, message });

      // Assert
      expect(signedMessage).toEqual(signature);
      expect(hwManager.signMessage).toHaveBeenCalledWith(wallet.hwInfo.derivationIndex, message);
    });
  });
});
