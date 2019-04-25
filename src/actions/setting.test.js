import { expect } from 'chai';
import actionTypes from '../constants/actions';
import {
  settingsReset,
  settingsUpdateToken,
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
      expect(settingsUpdated(data)).to.be.deep.equal(expectedAction);
    });
  });

  describe('settingsReset', () => {
    it('should create an action to reset settings', () => {
      const expectedAction = {
        type: actionTypes.settingsReset,
      };
      expect(settingsReset()).to.be.deep.equal(expectedAction);
    });
  });

  describe('settingsTokenUpdate', () => {
    it('should create an action to update settings token', () => {
      const data = {
        token: {
          active: 'LSK',
          list: {
            LSK: true,
            BTC: true,
          },
        },
      };

      const expectedAction = {
        type: actionTypes.settingsUpdateToken,
        data,
      };
      expect(settingsUpdateToken(data)).to.be.deep.equal(expectedAction);
    });
  });
});
