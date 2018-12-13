import { expect } from 'chai';
import settings from './settings';
import actionTypes from '../../constants/actions';


describe('Reducer: settings(state, action)', () => {
  let initializeState;

  beforeEach(() => {
    initializeState = { autoLog: true, advancedMode: false };
  });

  it('should return updated settings if action.type = actionTypes.settingsUpdated', () => {
    const action = {
      type: actionTypes.settingsUpdated,
      data: { autoLog: false },
    };
    const changedState = settings(initializeState, action);
    expect(changedState).to.deep.equal({ autoLog: false, advancedMode: false });
  });

  it('should return updated initializeState if action.type = actionTypes.settingsReset', () => {
    const action = {
      type: actionTypes.settingsReset,
    };
    const changedState = {
      autoLog: false, advancedMode: true,
    };
    const FinalStep = settings(changedState, action);
    expect(FinalStep).to.deep.equal(initializeState);
  });

  it('should return updated settings if action.type = actionTypes.switchChannel', () => {
    const action = {
      type: actionTypes.switchChannel,
      data: { name: 'twitter', value: true },
    };
    const changedState = settings(initializeState, action);
    expect(changedState.channels).to.deep.equal({ twitter: true });
  });
});
