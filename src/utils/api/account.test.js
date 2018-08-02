import { expect } from 'chai';
import { mock } from 'sinon';
import { getAccount, setSecondPassphrase } from './account';

describe('Utils: Account API', () => {
  const address = '1449310910991872227L';

  describe('getAccount', () => {
    let activePeerMock;
    const activePeer = {
      accounts: {
        get: () => {},
      },
    };

    beforeEach(() => {
      activePeerMock = mock(activePeer.accounts);
    });

    afterEach(() => {
      activePeerMock.verify();
      activePeerMock.restore();
    });

    it('should return a promise that is resolved when activePeer.getAccount() calls its callback with data.success == true', () => {
      const account = { address, balance: 0, publicKey: 'sample_key' };
      const response = { data: [{ ...account }] };

      activePeerMock.expects('get').withArgs({ address }).returnsPromise().resolves(response);
      const requestPromise = getAccount(activePeer, address);
      return expect(requestPromise).to.eventually.eql({ ...account, serverPublicKey: 'sample_key' });
    });

    it('should return a promise that is resolved even when activePeer.getAccount() calls its callback with data.success == false and "Account not found"', () => {
      const account = { address, balance: 0 };

      activePeerMock.expects('get').withArgs({ address }).returnsPromise().resolves({ data: [] });
      const requestPromise = getAccount(activePeer, address);
      return expect(requestPromise).to.eventually.eql(account);
    });

    it('should otherwise return a promise that is rejected', () => {
      const response = { success: false };

      activePeerMock.expects('get').withArgs({ address }).returnsPromise().rejects(response);
      const requestPromise = getAccount(activePeer, address);
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
