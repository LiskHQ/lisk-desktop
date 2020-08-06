import { expect } from 'chai';
import { getAccount, setSecondPassphrase } from './account';
import accounts from '../../../../test/constants/accounts';
import { getAPIClient } from './network';

const network = {
  networks: {
    LSK: {
      apiVersion: '',
    },
  },
};

jest.mock('./network', () => ({
  getAPIClient: jest.fn(),
}));

describe('Utils: Account API', () => {
  const { address, publicKey, passphrase } = accounts.genesis;

  describe('getAccount', () => {
    it('should return a promise that is resolved when liskAPIClient.getAccount() calls its callback with data.success == true', () => {
      const account = { address, balance: 0, publicKey };
      const response = { data: [{ ...account }] };
      getAPIClient.mockImplementation(() => ({
        accounts: {
          get: () =>
            new Promise(res => res(response)),
        },
      }));
      const requestPromise = getAccount({ address, network });

      return expect(requestPromise).to.eventually.eql({ ...account, serverPublicKey: publicKey, token: 'LSK' });
    });

    it('should return a promise that is resolved even when liskAPIClient.getAccount() calls its callback with data.success == false and "Account not found"', async () => {
      const account = { address, balance: 0 };

      getAPIClient.mockImplementation(() => ({
        accounts: {
          get: () =>
            new Promise(res => res({ data: [] })),
        },
      }));
      expect(await getAccount({ passphrase, network })).to.eql({ ...account, token: 'LSK', publicKey });
    });

    it('should otherwise return a promise that is rejected', () => {
      const response = { success: false };

      getAPIClient.mockImplementation(() => ({
        accounts: {
          get: () =>
            new Promise(res => res(response)),
        },
      }));

      const requestPromise = getAccount({ address, network });
      return expect(requestPromise).to.eventually.be.rejectedWith(response);
    });
  });

  describe('setSecondPassphrase', () => {
    it('should return a promise', () => {
      const promise = setSecondPassphrase();
      expect(typeof promise.then).to.be.equal('function');
    });
  });
});
