import settings from './settings';
import actionTypes from '../../constants/actions';
import { tokenKeys } from '../../constants/tokens';


describe('Reducer: settings(state, action)', () => {
  let initializeState;

  beforeEach(() => {
    initializeState = {
      autoLog: true,
      advancedMode: false,
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
    expect(changedState).toEqual({ ...initializeState, autoLog: false, advancedMode: false });
  });

  it('should return updated initializeState if action.type = actionTypes.settingsReset', () => {
    const action = {
      type: actionTypes.settingsReset,
    };
    const changedState = {
      ...initializeState,
      autoLog: false,
      advancedMode: true,
    };
    const FinalStep = settings(changedState, action);
    expect(FinalStep).toEqual(initializeState);
  });
});

