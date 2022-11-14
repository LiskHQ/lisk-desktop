import { tokenMap } from '@token/fungible/consts/tokens';
import actionTypes from './actionTypes';
import settings from './reducer';

describe('Reducer: settings(state, action)', () => {
  let initializeState;

  beforeEach(() => {
    initializeState = {
      token: {
        active: tokenMap.LSK.key,
        list: {
          [tokenMap.LSK.key]: true,
        },
      },
    };
  });

  it('should return updated settings if action.type = actionTypes.settingsUpdated', () => {
    const action = {
      type: actionTypes.settingsUpdated,
      data: { testSetting: false },
    };
    const changedState = settings(initializeState, action);
    expect(changedState).toEqual({ ...initializeState, testSetting: false });
  });

  it('should return updated initializeState if action.type = actionTypes.settingsReset', () => {
    const action = {
      type: actionTypes.settingsReset,
    };
    const changedState = {
      ...initializeState,
    };
    const FinalStep = settings(changedState, action);
    expect(FinalStep).toEqual(initializeState);
  });
});
