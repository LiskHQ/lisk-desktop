import { actionTypes } from '@common/configuration';
import network from './network';

describe('Reducer: network(state, action)', () => {
  it('should return state object with passed network setup if action is networkSet', () => {
    const state = {
      networks: {
        BTC: {},
      },
    };
    const action = {
      type: actionTypes.networkConfigSet,
      data: {
        name: 'Custom Node',
        token: 'LSK',
        network: state.network,
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

  it('should return state object with updated status of network if action is networkStatusUpdated', () => {
    let state;
    const online = true;
    const action = {
      type: actionTypes.networkStatusUpdated,
      data: { online },
    };

    const newState = {
      status: action.data,
      networks: {},
      storedCustomNetwork: '',
    };
    const changedState = network(state, action);
    expect(changedState).toEqual(newState);
  });

  it('should return state object with updated last BTC set', () => {
    let state;
    const lastBtcUpdate = 0;
    const action = {
      type: actionTypes.lastBtcUpdateSet,
      data: { lastBtcUpdate },
    };

    const newState = {
      status: {},
      networks: {},
      lastBtcUpdate: action.data,
      storedCustomNetwork: '',
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
