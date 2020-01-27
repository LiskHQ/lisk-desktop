import network from './network';
import actionTypes from '../../constants/actions';


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
});
