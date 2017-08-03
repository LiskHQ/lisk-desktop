import chai, { expect } from 'chai';
import { mock } from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import { getAccount, setSecondSecret, send, transactions,
  extractPublicKey, extractAddress } from './account';
import { activePeerSet } from '../../actions/peers';

chai.use(chaiAsPromised);
chai.use(sinonChai);

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
      const response = {
        success: true,
        balance: 0,
      };
      activePeerMock.expects('getAccount').withArgs(address).callsArgWith(1, response);
      const requestPromise = getAccount(activePeer, address);
      expect(requestPromise).to.eventually.deep.equal(response);
    });

    it('should return a promise that is resolved even when activePeer.getAccount() calls its callback with data.success == false', () => {
      const response = {
        success: false,
        message: 'account doesn\'t exist',
      };
      const account = {
        address,
        balance: 0,
      };
      activePeerMock.expects('getAccount').withArgs(address).callsArgWith(1, response);
      const requestPromise = getAccount(activePeer, address);
      expect(requestPromise).to.eventually.deep.equal(account);
    });

    it('it should resolve account info if available', () => {
      const network = {
        address: 'http://localhost:8000',
        testnet: true,
        name: 'Testnet',
        nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
      };

      const { data } = activePeerSet(network);
      getAccount(data, address).then((result) => {
        expect(result.balance).to.be.equal(0);
      });
    });
  });

  describe('setSecondSecret', () => {
    it('should return a promise', () => {
      const promise = setSecondSecret();
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
      const promise = transactions();
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
