import { expect } from 'chai';
import peers from './peers';
import actionTypes from '../../constants/actions';


describe('Reducer: peers(state, action)', () => {
  it('should return state object with data of active peer in state.data if action is activePeerSet', () => {
    const state = {};
    const action = {
      type: actionTypes.activePeerSet,
      data: {
        currentPeer: 'localhost',
        port: 4000,
        options: {
          name: 'Custom Node',
        },
      },
    };

    const newState = { data: action.data, options: action.data.options };
    const changedState = peers(state, action);
    expect(changedState).to.deep.equal(newState);
  });

  it('should return state object with updated status of active peer if action is activePeerUpdate', () => {
    const state = {};
    const action = {
      type: actionTypes.activePeerUpdate,
      data: { online: true },
    };

    const newState = { status: action.data };
    const changedState = peers(state, action);
    expect(changedState).to.deep.equal(newState);
  });

  it('should return and empty state object if action is accountLoggedOut', () => {
    const state = {
      data: {
        currentPeer: 'localhost',
        port: 4000,
        options: {
          name: 'Custom Node',
        },
      },
      status: { online: true },
    };
    const action = {
      type: actionTypes.accountLoggedOut,
    };

    const newState = { status: {}, data: {}, options: {} };
    const changedState = peers(state, action);
    expect(changedState).to.deep.equal(newState);
  });
});

