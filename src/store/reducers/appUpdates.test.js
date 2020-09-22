import appUpdates from './appUpdates';
import actionTypes from '../../constants/actions';

describe('Reducer: appUpdates(state, action)', () => {
  it('should return account object with changes if action.type = actionTypes.appUpdateAvailable', () => {
    const state = {};
    const action = {
      type: actionTypes.appUpdateAvailable,
      data: {
        version: '2',
        ipc: jest.fn(),
        releaseNotes: jest.fn(),
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
