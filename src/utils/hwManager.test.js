import { getAccountsFromDevice, signSendTransaction, signVoteTransaction } from './hwManager';
import * as accountApi from './api/lsk/account';
import accounts from '../../test/constants/accounts';
import * as communication from '../../libs/hwManager/communication';

jest.mock('../../libs/hwManager/communication', () => ({
  getPublicKey: jest.fn(),
  signTransaction: jest.fn(),
}));

jest.mock('./api/lsk/account', () => ({
  getAccount: jest.fn(),
}));

describe('hwManager util', () => {
  beforeEach(() => {
    communication.signTransaction.mockResolvedValueOnce('abc123ABC789');
  });

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

  describe('signSendTransaction', () => {
    it('should return a transaction object with the proper signature', async () => {
      const account = {
        info: {
          LSK: {
            address: '7955155501030618852L',
            publicKey: '9c854ea85fbcb32e2c5d2c7a820a354a6627213ebb74b42b1ee851d4e4fa035e',
          },
        },
        hwInfo: {
          deviceId: '060E803263E985C022CA2C9B',
          derivationIndex: 0,
        },
      };

      const data = {
        amount: '100000000',
        data: 'testing',
        fee: '10000000',
        passphrase: undefined,
        recipientId: '7955155501030618852L',
        secondPassphrase: null,
        dynamicFeePerByte: 0,
      };

      const signedTransactions = await signSendTransaction(account, data);

      expect(signedTransactions).toHaveProperty('id');
      expect(signedTransactions).toHaveProperty('signature');
      expect(signedTransactions).toHaveProperty('amount', '100000000');
      expect(signedTransactions).toHaveProperty('asset', { data: 'testing' });
      expect(signedTransactions).toHaveProperty('fee', '10000000');
      expect(signedTransactions).toHaveProperty('recipientId', '7955155501030618852L');
      expect(signedTransactions).toHaveProperty('senderPublicKey', '9c854ea85fbcb32e2c5d2c7a820a354a6627213ebb74b42b1ee851d4e4fa035e');
    });
  });

  describe('signVoteTransaction', () => {
    it('should return a transaction object with the proper signature', async () => {
      const account = {
        address: '7955155501030618852L',
        publicKey: '9c854ea85fbcb32e2c5d2c7a820a354a6627213ebb74b42b1ee851d4e4fa035e',
        hwInfo: {
          deviceId: '060E803263E985C022CA2C9B',
          derivationIndex: 0,
        },
      };

      const votedList = ['3193057832bb1c9782a8e4a32e543b535ed9d750b1b10383f8b6f50853569609'];
      const unvotedList = ['473c354cdf627b82e9113e02a337486dd3afc5615eb71ffd311c5a0beda37b8c'];

      const signedTransactions = await signVoteTransaction(account, votedList, unvotedList);
      signedTransactions.forEach((tx) => {
        expect(tx).toHaveProperty('id');
        expect(tx).toHaveProperty('signature');
        expect(tx).toHaveProperty('amount', '0');
        expect(tx).toHaveProperty('asset');
        expect(tx).toHaveProperty('fee', '100000000');
        expect(tx).toHaveProperty('recipientId', '7955155501030618852L');
        expect(tx).toHaveProperty('senderPublicKey', '9c854ea85fbcb32e2c5d2c7a820a354a6627213ebb74b42b1ee851d4e4fa035e');
      });
    });
  });
});
