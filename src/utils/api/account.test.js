import { expect } from 'chai';
import { mock } from 'sinon';
import { getAccount, setSecondPassphrase, send, transactions, unconfirmedTransactions,
  extractPublicKey, extractAddress } from './account';

describe('Utils: Account', () => {
  const address = '1449310910991872227L';

  describe('getAccount', () => {
    let activePeerMock;
    const activePeer = {
      getAccount: () => { },
    };

    beforeEach(() => {
      activePeerMock = mock(activePeer);
    });

    afterEach(() => {
      activePeerMock.verify();
      activePeerMock.restore();
    });

    it('should return a promise that is resolved when activePeer.getAccount() calls its callback with data.success == true', () => {
      const account = { address, balance: 0, publicKey: 'sample_key' };
      const response = { success: true, account };

      activePeerMock.expects('getAccount').withArgs(address).callsArgWith(1, response);
      const requestPromise = getAccount(activePeer, address);
      return expect(requestPromise).to.eventually.eql({ ...account, serverPublicKey: 'sample_key' });
    });

    it('should return a promise that is resolved even when activePeer.getAccount() calls its callback with data.success == false and "Account not found"', () => {
      const response = { success: false, error: 'Account not found' };
      const account = { address, balance: 0 };

      activePeerMock.expects('getAccount').withArgs(address).callsArgWith(1, response);
      const requestPromise = getAccount(activePeer, address);
      return expect(requestPromise).to.eventually.eql(account);
    });

    it('should otherwise return a promise that is rejected', () => {
      const response = { success: false };

      activePeerMock.expects('getAccount').withArgs(address).callsArgWith(1, response);
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

  describe('send', () => {
    it('should return a promise', () => {
      const promise = send();
      expect(typeof promise.then).to.be.equal('function');
    });
  });

  describe('transactions', () => {
    it('should return a promise', () => {
      const promise = transactions({ activePeer: {} });
      expect(typeof promise.then).to.be.equal('function');
    });
  });

  describe('unconfirmedTransactions', () => {
    it('should return a promise', () => {
      const promise = unconfirmedTransactions();
      expect(typeof promise.then).to.be.equal('function');
    });
  });

  describe('extractPublicKey', () => {
    it('should return a Hex string from any given string', () => {
      const passphrase = 'field organ country moon fancy glare pencil combine derive fringe security pave';
      const publicKey = 'a89751689c446067cc2107ec2690f612eb47b5939d5570d0d54b81eafaf328de';
      expect(extractPublicKey(passphrase)).to.be.equal(publicKey);
    });
  });

  describe('extractAddress', () => {
    it('should return the account address from given passphrase', () => {
      const passphrase = 'field organ country moon fancy glare pencil combine derive fringe security pave';
      const derivedAddress = '440670704090200331L';
      expect(extractAddress(passphrase)).to.be.equal(derivedAddress);
    });

    it('should return the account address from given public key', () => {
      const publicKey = 'a89751689c446067cc2107ec2690f612eb47b5939d5570d0d54b81eafaf328de';
      const derivedAddress = '440670704090200331L';
      expect(extractAddress(publicKey)).to.be.equal(derivedAddress);
    });
  });
});
