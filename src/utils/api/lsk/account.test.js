import { expect } from 'chai';
import { mock } from 'sinon';
import { getAccount, setSecondPassphrase } from './account';
import accounts from '../../../../test/constants/accounts';

const networkConfig = {
  network: {
    networks: {
      LSK: {
        apiVersion: '',
      },
    },
  },
};

describe('Utils: Account API', () => {
  const { address, publicKey, passphrase } = accounts.genesis;

  describe('getAccount', () => {
    let liskAPIClientMock;
    const liskAPIClient = {
      accounts: {
        get: () => {},
      },
    };

    beforeEach(() => {
      liskAPIClientMock = mock(liskAPIClient.accounts);
    });

    afterEach(() => {
      liskAPIClientMock.verify();
      liskAPIClientMock.restore();
    });

    it('should return a promise that is resolved when liskAPIClient.getAccount() calls its callback with data.success == true', () => {
      const account = { address, balance: 0, publicKey };
      const response = { data: [{ ...account }] };

      liskAPIClientMock.expects('get').withArgs({ address }).resolves(response);
      const requestPromise = getAccount({ liskAPIClient, address, networkConfig });
      return expect(requestPromise).to.eventually.eql({ ...account, serverPublicKey: publicKey, token: 'LSK' });
    });

    it('should return a promise that is resolved even when liskAPIClient.getAccount() calls its callback with data.success == false and "Account not found"', async () => {
      const account = { address, balance: 0 };

      liskAPIClientMock.expects('get').withArgs({ address }).resolves({ data: [] });
      expect(await getAccount({ liskAPIClient, passphrase, networkConfig })).to.eql({ ...account, token: 'LSK', publicKey });
    });

    it('should otherwise return a promise that is rejected', () => {
      const response = { success: false };

      liskAPIClientMock.expects('get').withArgs({ address }).rejects(response);
      const requestPromise = getAccount({ liskAPIClient, address, networkConfig });
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
