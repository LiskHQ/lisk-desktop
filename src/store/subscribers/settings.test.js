import { expect } from 'chai';
import { spy } from 'sinon';
import settings from './settings';
import * as settingsUtils from '../../utils/settings';

describe('Subscriber: settings(state)', () => {
  const settingsObject = {
    currency: 'USD',
    autoLogout: true,
  };

  it('should save accounts in localStorage', () => {
    spy(settingsUtils, 'setSettingsInLocalStorage');
    const state = { settings: settingsObject };
    const store = { getState: () => state };

    settings(store);
    expect(settingsUtils.setSettingsInLocalStorage)
      .to.have.been.calledWith(state.settings);

    settingsUtils.setSettingsInLocalStorage.restore();
  });
});

