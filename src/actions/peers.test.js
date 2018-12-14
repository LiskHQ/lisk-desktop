import { expect } from 'chai';
import Lisk from 'lisk-elements';
import { spy, stub, match } from 'sinon';
import actionTypes from '../constants/actions';
import { liskAPIClientSet, liskAPIClientUpdate } from './peers';
import accounts from '../../test/constants/accounts';
import networks from '../constants/networks';


describe('actions: peers', () => {
  let getState;
  const { passphrase } = accounts.genesis;
  const nethash = '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d';

  describe('liskAPIClientUpdate', () => {
    it('should create an action to update the active peer', () => {
      const data = {
        online: true,
      };

      const expectedAction = {
        data,
        type: actionTypes.liskAPIClientUpdate,
      };
      expect(liskAPIClientUpdate(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('liskAPIClientSet', () => {
    let dispatch;
    let APIClientBackup;
    let getConstantsMock;

    beforeEach(() => {
      dispatch = spy();
      APIClientBackup = Lisk.APIClient;
      getConstantsMock = stub().returnsPromise();

      getState = () => ({
        peers: {
          liskAPIClient: {},
        },
        account: {},
        settings: { autoLog: true },
      });

      // TODO: find a better way of mocking Lisk.APIClient
      Lisk.APIClient = class MockAPIClient {
        constructor() {
          this.node = {
            getConstants: getConstantsMock,
          };
        }
      };
      Lisk.APIClient.constants = APIClientBackup.constants;

      getConstantsMock.resolves({ data: { nethash } });
    });

    afterEach(() => {
      Lisk.APIClient = APIClientBackup;
    });

    it('creates active peer config', () => {
      const data = {
        passphrase,
        network: {
          name: 'Custom Node',
          custom: true,
          address: 'localhost:8000',
          testnet: true,
          nethash,
        },
      };
      liskAPIClientSet(data)(dispatch, getState);
      expect(dispatch).to.have.been.calledWith(match.hasNested('data.options.address', 'localhost:8000'));
    });

    it('dispatch liskAPIClientSet action also when address http missing', () => {
      const network = { address: 'localhost:8000' };

      liskAPIClientSet({ passphrase, network })(dispatch, getState);

      expect(dispatch).to.have.been.calledWith(match.hasNested('data.options.address', 'localhost:8000'));
    });

    it('dispatch liskAPIClientSet action with nodeXX.lisk.io node if mainnet', () => {
      const network = networks.mainnet;

      liskAPIClientSet({ passphrase, network })(dispatch, getState);

      expect(dispatch).to.have.been.calledWith(match.hasNested(
        'data.options.nodes',
        networks.mainnet.nodes,
      ));
    });

    it('dispatch liskAPIClientSet action with testnet nodes if testnet option is set', () => {
      const network = {
        testnet: true,
      };

      liskAPIClientSet({ passphrase, network })(dispatch, getState);
      expect(dispatch).to.have.been.calledWith(match.hasNested('data.options.nodes', networks.testnet.nodes));
    });

    it('dispatch liskAPIClientSet with custom node', () => {
      const network = {
        address: 'http://localhost:4000',
        custom: true,
      };

      liskAPIClientSet({ passphrase, network })(dispatch, getState);
      expect(dispatch).to.have.been.calledWith(match.hasNested('data.options.nodes[0]', 'http://localhost:4000'));
    });

    it('displays the error toast if the network is custom and request to constants fails', () => {
      getConstantsMock.rejects({});
      const network = {
        address: 'http://localhost:4000',
        custom: true,
      };
      liskAPIClientSet({ passphrase, network })(dispatch, getState);
      expect(dispatch).to.have.been.calledWith({
        data: { label: 'Unable to connect to the node, no response from the server.', type: 'error' },
        type: actionTypes.toastDisplayed,
      });
    });

    it('dispatch liskAPIClientSet action even if network is undefined', () => {
      liskAPIClientSet({ passphrase, network: {} })(dispatch, getState);

      expect(dispatch).to.have.been.calledWith();
    });

    it('dispatch liskAPIClientSet action when hwAccount is logged in ', () => {
      const network = {
        testnet: true,
      };

      liskAPIClientSet({ passphrase, network, hwInfo: {} })(dispatch, getState);
      expect(dispatch).to.have.been.calledWith(match.hasNested('data.options.nodes', networks.testnet.nodes));
    });

    it('dispatch liskAPIClientSet action even if network.address is undefined', () => {
      liskAPIClientSet({ passphrase, network: {} })(dispatch, getState);

      expect(dispatch).to.have.been.calledWith();
    });

    it('should set to testnet if not defined in config but port is 7000', () => {
      const network7000 = { address: 'http://127.0.0.1:7000', nethash };
      const network4000 = { address: 'http://127.0.0.1:4000', nethash };

      liskAPIClientSet({ passphrase, network: network7000 })(dispatch, getState);
      expect(dispatch).to.have.been.calledWith(match.hasNested('data.options.nodes[0]', network7000.address));
      expect(dispatch).to.have.been.calledWith(match.hasNested('data.options.nethash', nethash));

      liskAPIClientSet({ passphrase, network: network4000 })(dispatch, getState);
      expect(dispatch).to.have.been.calledWith(match.hasNested('data.options.nodes[0]', network4000.address));
      expect(dispatch).to.have.been.calledWith(match.hasNested('data.options.nethash', nethash));
    });
  });
});
