import { expect } from 'chai';
import { spy, stub, match } from 'sinon';
import actionTypes from '../constants/actions';
import netHashes from '../constants/netHashes';
import { activePeerSet, activePeerUpdate } from './peers';
import * as nethashApi from './../utils/api/nethash';


describe('actions: peers', () => {
  const passphrase = 'wagon stock borrow episode laundry kitten salute link globe zero feed marble';
  const nethash = '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d';

  describe('activePeerUpdate', () => {
    it('should create an action to update the active peer', () => {
      const data = {
        online: true,
      };

      const expectedAction = {
        data,
        type: actionTypes.activePeerUpdate,
      };
      expect(activePeerUpdate(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('activePeerSet', () => {
    let dispatch;
    let getNetHash;

    beforeEach(() => {
      dispatch = spy();
      getNetHash = stub(nethashApi, 'getNethash');
    });

    afterEach(() => {
      getNetHash.restore();
    });

    it('creates active peer config', () => {
      getNetHash.returnsPromise();
      const data = {
        passphrase,
        network: {
          name: 'Custom Node',
          custom: true,
          address: 'http://localhost:4000',
          testnet: true,
          nethash,
        },
      };

      activePeerSet(data)(dispatch);
      getNetHash.resolves({ nethash });

      expect(dispatch).to.have.been.calledWith(match.hasNested('data.activePeer.options', data.network));
    });

    it('dispatch activePeerSet action also when address http missing', () => {
      const network = { address: 'localhost:8000' };

      activePeerSet({ passphrase, network })(dispatch);

      expect(dispatch).to.have.been.calledWith(match.hasNested('data.activePeer.options.address', 'localhost:8000'));
    });

    it('dispatch activePeerSet with testnet config set to true when the network is a custom node and nethash is testnet', () => {
      getNetHash.returnsPromise();
      const network = {
        address: 'http://localhost:4000',
        custom: true,
      };

      activePeerSet({ passphrase, network })(dispatch);
      getNetHash.resolves({ nethash: netHashes.testnet });

      expect(dispatch).to.have.been.calledWith(match.hasNested('data.activePeer.testnet', true));
    });

    it('dispatch activePeerSet with testnet config set to false when the network is a custom node and nethash is testnet', () => {
      getNetHash.returnsPromise();
      const network = {
        address: 'http://localhost:4000',
        custom: true,
      };

      activePeerSet({ passphrase, network })(dispatch);
      getNetHash.resolves({ nethash: 'some other nethash' });

      expect(dispatch).to.have.been.calledWith(match.hasNested('data.activePeer.testnet', false));
    });

    it('dispatch activePeerSet action even if network is undefined', () => {
      activePeerSet({ passphrase })(dispatch);

      expect(dispatch).to.have.been.calledWith();
    });

    it('dispatch activePeerSet action even if network.address is undefined', () => {
      activePeerSet({ passphrase, network: {} })(dispatch);

      expect(dispatch).to.have.been.calledWith();
    });

    it('should set to testnet if not defined in config but port is 7000', () => {
      const network7000 = { address: 'http://127.0.0.1:7000', nethash };
      const network4000 = { address: 'http://127.0.0.1:4000', nethash };

      activePeerSet({ passphrase, network: network7000 })(dispatch);
      expect(dispatch).to.have.been.calledWith(match.hasNested('data.activePeer.options.testnet', true));

      activePeerSet({ passphrase, network: network4000 })(dispatch);
      expect(dispatch).to.have.been.calledWith(match.hasNested('data.activePeer.options.testnet', false));
    });
  });
});
