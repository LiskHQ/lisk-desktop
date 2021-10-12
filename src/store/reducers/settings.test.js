import { actionTypes, tokenKeys } from '@constants';
import settings from './settings';

describe('Reducer: settings(state, action)', () => {
  let initializeState;

  beforeEach(() => {
    initializeState = {
      autoLog: true,
      token: {
        active: tokenKeys[0],
        list: tokenKeys.reduce((acc, key) => { acc[key] = true; return acc; }, {}),
      },
    };
  });

  it('should return updated settings if action.type = actionTypes.settingsUpdated', () => {
    const action = {
      type: actionTypes.settingsUpdated,
      data: { autoLog: false },
    };
    const changedState = settings(initializeState, action);
    expect(changedState).toEqual({ ...initializeState, autoLog: false });
  });

  it('should return updated initializeState if action.type = actionTypes.settingsReset', () => {
    const action = {
      type: actionTypes.settingsReset,
    };
    const changedState = {
      ...initializeState,
      autoLog: false,
    };
    const FinalStep = settings(changedState, action);
    expect(FinalStep).toEqual(initializeState);
  });

  it('should return retrieved settings if action.type = actionTypes.settingsRetrieved', () => {
    let state;
    const action = {
      type: actionTypes.settingsRetrieved,
      data: { },
    };

    const changedState = settings(state, action);
    expect(changedState).toEqual(action.data);
  });
});
