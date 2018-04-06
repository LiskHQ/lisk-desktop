import { spy, mock, stub } from 'sinon';

import actionType from '../../constants/actions';
import savedSettingsMiddleware from './savedSettings';


describe('saved Settings middleware', () => {
  let store;
  let next;
  let action;
  let localStorageMock;
  const Settings = { autoLog: true, advancedMode: false };

  beforeEach(() => {
    store = stub();
    store.dispatch = spy();
    next = spy();
    store.getState = () => ({ Settings });

    localStorageMock = mock(localStorage);
  });

  afterEach(() => {
    localStorageMock.restore();
  });

  it('should update value of "settings" in localStorage when action.type === actionType.settingsUpdated', () => {
    action = {
      type: actionType.settingsUpdated,
      data: { autoLog: false, advancedMode: true },
    };
    savedSettingsMiddleware(store)(next)(action);

    localStorageMock.expects('setItem')
      .withExactArgs('settings', { autoLog: false, advancedMode: true });
  });

  it('should remove value of "settings" in localStorage when action.type === actionType.settingsReset', () => {
    action = {
      type: actionType.settingsReset,
    };
    savedSettingsMiddleware(store)(next)(action);

    localStorageMock.expects('removeItem')
      .withExactArgs('settings');
  });
});
