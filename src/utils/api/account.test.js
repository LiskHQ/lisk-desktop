import chai, { expect } from 'chai';
import { mock } from 'sinon';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import { getAccount, setSecondSecret, send, transactions } from './account';
import { setActivePeer } from './peers';
import store from '../../reducers';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('Account', () => {
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

      const { data } = setActivePeer(store, network);
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
});
