import { expect } from 'chai';
import toaster from './toaster';
import actionTypes from '../../constants/actions';

describe('Reducer: toaster(state, action)', () => {
  it('should return action.data if action.type = actionTypes.toastDisplayed', () => {
    const state = { };
    const action = {
      type: actionTypes.toastDisplayed,
      data: {
        label: 'test toast',
      },
    };
    const changedState = toaster(state, action);
    expect(changedState).to.deep.equal(action.data);
  });

  it('should return empty obejct if action.type = actionTypes.toastHidden', () => {
    const state = { label: 'test toast' };
    const action = {
      type: actionTypes.toastHidden,
    };
    const changedState = toaster(state, action);
    expect(changedState).to.deep.equal({});
  });
});

