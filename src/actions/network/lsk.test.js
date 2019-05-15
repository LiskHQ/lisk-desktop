import Lisk from '@liskhq/lisk-client';
import { networkSet } from './lsk';
import networks from '../../constants/networks';
import { tokenMap } from '../../constants/tokens';
import actionTypes from '../../constants/actions';

describe('actions: network.lsk', () => {
  let dispatch;
  let APIClientBackup;
  let getConstantsMock;
  const nethash = '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d';

  beforeEach(() => {
    dispatch = jest.fn();
    APIClientBackup = Lisk.APIClient;
    getConstantsMock = jest.fn();

    // TODO: find a better way of mocking Lisk.APIClient
    Lisk.APIClient = class MockAPIClient {
      constructor() {
        this.node = {
          getConstants: getConstantsMock,
        };
      }
    };
    Lisk.APIClient.constants = APIClientBackup.constants;

    jest.resetModules();
  });

  afterEach(() => {
    Lisk.APIClient = APIClientBackup;
  });

  describe('networkSet', () => {
    it('should dispatch networkSet action with mainnet name', () => {
      const { name } = networks.mainnet;
      networkSet({ name })(dispatch);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        data: {
          name,
          token: tokenMap.LSK.key,
          network: {},
        },
        type: actionTypes.networkSet,
      }));
    });

    it('should dispatch networkSet action with customNode name, token, and network', async () => {
      const { name, nodeUrl } = networks.customNode;
      getConstantsMock.mockResolvedValue({ data: { nethash } });
      await networkSet({ name, nodeUrl })(dispatch);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        data: {
          name,
          token: tokenMap.LSK.key,
          network: {
            nodeUrl,
            nethash,
          },
        },
        type: actionTypes.networkSet,
      }));
    });

    // TODO figure out why the expected dispatch is not called
    it('should dispatch error toast if customNode unreachable without error messsage', async () => {
      const { name, nodeUrl } = networks.customNode;
      const error = { };
      getConstantsMock.mockRejectedValue(error);
      await networkSet({ name, nodeUrl })(dispatch);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        data: {
          label: 'Unable to connect to the node, no response from the server.',
          type: 'error',
        },
        type: actionTypes.toastDisplayed,
      }));
    });

    it('should dispatch error toast if customNode unreachable with custom error message', async () => {
      const { name, nodeUrl } = networks.customNode;
      const error = { message: 'Custom error message' };
      getConstantsMock.mockRejectedValue(error);
      await networkSet({ name, nodeUrl })(dispatch);
      expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
        data: {
          label: 'Unable to connect to the node, Error: Custom error message',
          type: 'error',
        },
        type: actionTypes.toastDisplayed,
      }));
    });
  });
});
