import { actionTypes } from '@common/configuration';
import { tokenMap } from '@token/configuration/tokens';
import settings from './settings';

describe('Reducer: settings(state, action)', () => {
  let initializeState;

  beforeEach(() => {
    initializeState = {
      autoLog: true,
      token: {
        active: tokenMap.LSK.key,
        list: {
          [tokenMap.LSK.key]: true,
          [tokenMap.BTC.key]: false,
        },
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
