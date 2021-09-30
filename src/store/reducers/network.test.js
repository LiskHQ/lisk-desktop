import { actionTypes } from '@constants';
import network from './network';

describe('Reducer: network(state, action)', () => {
  it.skip('should return state object with passed network setup if action is networkSet', () => {
    const state = {
      networks: {
        BTC: {
        },
      },
    };
    const action = {
      type: actionTypes.networkSet,
      data: {
        name: 'Custom Node',
        token: 'LSK',
        network: {
          nodeUrl: 'http://localhost:4000',
        },
      },
    };

    const newState = {
      name: action.data.name,
      networks: {
        LSK: action.data.network,
        BTC: {},
      },
    };
    const changedState = network(state, action);
    expect(changedState).toEqual(newState);
  });

  it.skip('should return state object with updated status of network if action is networkStatusUpdated', () => {
    let state;
    const online = true;
    const action = {
      type: actionTypes.networkStatusUpdated,
      data: { online },
    };

    const newState = {
      status: action.data,
      networks: {},
    };
    const changedState = network(state, action);
    expect(changedState).toEqual(newState);
  });

  it('should store new network info on customNetworkStored', () => {
    const action = {
      type: actionTypes.customNetworkStored,
      data: 'http://example.com',
    };
    const state = {
      storedCustomNetwork: '',
    };
    const changedState = network(state, action);
    expect(changedState).toEqual({
      storedCustomNetwork: 'http://example.com',
    });
  });

  it('should remove existing network info on customNetworkRemoved', () => {
    const action = {
      type: actionTypes.customNetworkRemoved,
    };
    const state = {
      storedCustomNetwork: 'http://example.com',
    };
    const changedState = network(state, action);
    expect(changedState).toEqual({
      storedCustomNetwork: '',
    });
  });
});
