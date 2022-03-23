import { actionTypes } from '@common/configuration';
import appUpdates from './appUpdates';

describe('Reducer: appUpdates(state, action)', () => {
  it('should return account object with changes if action.type = actionTypes.appUpdateAvailable', () => {
    const state = {};
    const action = {
      type: actionTypes.appUpdateAvailable,
      data: {
        version: '1.3.1',
        releaseNotes: '<h4>dummy text</h4><h3>Fixed bugs</h3>',
        remindMeLater: jest.fn(),
        updateNow: jest.fn(),
      },
    };
    const changedAccount = appUpdates(state, action);
    expect(changedAccount).toEqual(action.data);
  });

  it('should return state if action.type is none of the above', () => {
    const state = { version: '3' };
    const action = {
      type: 'UNKNOWN',
    };
    const changedAccount = appUpdates(state, action);
    expect(changedAccount).toEqual(state);
  });
});
