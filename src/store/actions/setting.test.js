import { actionTypes } from '@constants';
import {
  settingsReset,
  settingsUpdated,
} from './settings';


describe('actions: setting', () => {
  describe('settingsUpdated', () => {
    it('should create an action to update settings', () => {
      const data = { autoLog: false };

      const expectedAction = {
        data,
        type: actionTypes.settingsUpdated,
      };
      expect(settingsUpdated(data)).toEqual(expectedAction);
    });
  });

  describe('settingsReset', () => {
    it('should create an action to reset settings', () => {
      const expectedAction = {
        type: actionTypes.settingsReset,
      };
      expect(settingsReset()).toEqual(expectedAction);
    });
  });
});
