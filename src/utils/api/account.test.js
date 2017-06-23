import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { getPeer, setSecondSecret, send, transactions } from './account';
import { setActivePeer } from './peers';
import store from '../../reducers';

chai.use(sinonChai);

describe('Peers', () => {
  describe('getPeer', () => {
    it('should return a promise', () => {
      const promise = getPeer();
      expect(typeof promise.then).to.be.equal('function');
    });

    it('it should resolve account info if available', () => {
      const network = {
        address: 'http://localhost:8000',
        testnet: true,
        name: 'Testnet',
        nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
      };
      const address = '1449310910991872227L';

      const { data } = setActivePeer(store, network);
      getPeer(data, address).then((result) => {
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
