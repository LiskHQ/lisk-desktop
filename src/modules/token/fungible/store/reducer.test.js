import { tokenMap } from '@token/fungible/consts/tokens';
import actionTypes from './actionTypes';
import token from './reducer';

describe('Reducer: token(state, action)', () => {
  let initializeState;

  beforeEach(() => {
    initializeState = {
      active: tokenMap.LSK.key,
      list: {
        [tokenMap.LSK.key]: true,
      },
    };
  });

  it('should return updated token if action.type = actionTypes.tokenUpdated', () => {
    const action = {
      type: actionTypes.tokenUpdated,
      data: { active: 'TKN' },
    };
    const changedState = token(initializeState, action);
    expect(changedState).toEqual({ ...initializeState, active: 'TKN' });
  });

  it('should return updated initializeState if action.type = actionTypes.tokenReset', () => {
    const action = {
      type: actionTypes.tokenReset,
    };
    const currentState = {
      ...initializeState,
      active: 'TKN',
    };
    const changedState = {
      ...currentState,
      active: tokenMap.LSK.key,
    };
    const FinalStep = token(changedState, action);
    expect(FinalStep).toEqual(initializeState);
  });

  it('should return retrieved token if action.type = actionTypes.tokenRetrieved', () => {
    let state;
    const action = {
      type: actionTypes.tokenRetrieved,
      data: { },
    };

    const changedState = token(state, action);
    expect(changedState).toEqual(action.data);
  });
});
