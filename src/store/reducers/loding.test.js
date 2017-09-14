import { expect } from 'chai';
import loading from './loading';
import actionTypes from '../../constants/actions';


describe('Reducer: loading(state, action)', () => {
  let state;

  beforeEach(() => {
    state = ['test1', 'test2'];
  });

  it('should return loading array with the new loading if action.type = actionTypes.loadingStarted', () => {
    const action = {
      type: actionTypes.loadingStarted,
      data: 'test3',
    };
    const changedState = loading(state, action);
    expect(changedState).to.deep.equal([...state, action.data]);
  });

  it('should return loading array without action.data if action.type = actionTypes.loadingFinished', () => {
    const action = {
      type: actionTypes.loadingFinished,
      data: 'test1',
    };
    const changedState = loading(state, action);
    expect(changedState).to.deep.equal(['test2']);
  });
});

