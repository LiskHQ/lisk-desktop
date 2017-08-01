import { expect } from 'chai';
import toaster from './toaster';
import actionTypes from '../../constants/actions';

describe('Reducer: toaster(state, action)', () => {
  it('should return action.data with index if action.type = actionTypes.toastDisplayed', () => {
    const state = [];
    const action = {
      type: actionTypes.toastDisplayed,
      data: {
        label: 'test toast',
      },
    };
    const changedState = toaster(state, action);
    expect(changedState).to.deep.equal([{ ...action.data, index: 0 }]);
  });

  it('should return array without given toast if action.type = actionTypes.toastHidden', () => {
    const toast = { label: 'test toast', index: 0 };
    const state = [toast];
    const action = {
      type: actionTypes.toastHidden,
      data: toast,
    };
    const changedState = toaster(state, action);
    expect(changedState).to.deep.equal([]);
  });
});

