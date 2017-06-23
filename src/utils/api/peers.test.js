import chai, { expect } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import { setActivePeer, resetActivePeer, requestToActivePeer } from './peers';
import store from '../../reducers';

chai.use(sinonChai);

describe('Peers', () => {
  describe('requestToActivePeer', () => {
    it('should return a promise', () => {
      const _requestToActivePeer = requestToActivePeer();
      expect(typeof _requestToActivePeer.then).to.be.equal('function');
    });
  });

  describe('setActivePeer', () => {
    it('dispatch activePeerSet action', () => {
      const network = {
        address: 'http://localhost:4000',
        testnet: true,
        nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
      };
      const actionSpy = spy(store, 'dispatch');
      setActivePeer(store, network);
      expect(actionSpy).to.have.been.calledWith();
      store.dispatch.restore();
    });

    it('should set to testnet if not defined in config but port is 7000', () => {
      const network7000 = {
        address: 'http://127.0.0.1:7000',
        nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
      };
      const network4000 = {
        address: 'http://127.0.0.1:4000',
        nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
      };

      let activePeer = setActivePeer(store, network7000);
      expect(activePeer.data.testnet).to.be.equal(true);
      activePeer = setActivePeer(store, network4000);
      expect(activePeer.data.testnet).to.be.equal(false);
    });
  });

  describe('resetActivePeer', () => {
    it('dispatch activePeerReset action', () => {
      const actionSpy = spy(store, 'dispatch');

      resetActivePeer(store);
      expect(actionSpy).to.have.been.calledWith();
      store.dispatch.restore();
    });
  });
});
