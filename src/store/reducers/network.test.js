import { actionTypes } from '@constants';
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
    };
    const changedState = network(state, action);
    expect(changedState).toEqual(newState);
  });
});
