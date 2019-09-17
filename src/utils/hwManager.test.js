import { getAccountsFromDevice } from './hwManager';
import * as accountApi from './api/lsk/account';
import accounts from '../../test/constants/accounts';
import * as communication from '../../libs/hwManager/communication';

jest.mock('../../libs/hwManager/communication', () => ({
  getPublicKey: jest.fn(),
}));

jest.mock('./api/lsk/account', () => ({
  getAccount: jest.fn(),
}));

describe('hwManager util', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccountsFromDevice', () => {
    it('should resolve all non-empty and one empty account', async () => {
      communication.getPublicKey.mockResolvedValueOnce(accounts.genesis.publicKey);
      communication.getPublicKey.mockResolvedValueOnce(accounts.empty_account.publicKey);
      accountApi.getAccount.mockResolvedValueOnce(accounts.genesis);
      accountApi.getAccount.mockResolvedValueOnce(accounts.empty_account);

      const device = { deviceId: '1234125125' };
      const networkConfig = { name: 'Testnet', networks: {} };

      const accountsOnDevice = await getAccountsFromDevice({ device, networkConfig });

      expect(accountsOnDevice).toEqual([accounts.genesis, accounts.empty_account]);
    });
  });
});
