import { expect } from 'chai';
import peers from './peers';
import actionTypes from '../../constants/actions';


describe('Reducer: peers(state, action)', () => {
  it('should return state object with data of active peer in state.data if action is liskAPIClientSet', () => {
    const state = {};
    const action = {
      type: actionTypes.liskAPIClientSet,
      data: {
        currentPeer: 'localhost',
        port: 4000,
        options: {
          name: 'Custom Node',
        },
      },
    };

    const newState = { liskAPIClient: action.data, options: action.data.options };
    const changedState = peers(state, action);
    expect(changedState).to.deep.equal(newState);
  });

  it('should return state object with updated status of active peer if action is liskAPIClientUpdate', () => {
    const state = {};
    const action = {
      type: actionTypes.liskAPIClientUpdate,
      data: { online: true },
    };

    const newState = { status: action.data };
    const changedState = peers(state, action);
    expect(changedState).to.deep.equal(newState);
  });
});
