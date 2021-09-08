import { actionTypes } from '@constants';
import {
  settingsReset,
  settingsUpdated,
  settingsRetrieved,
} from './settings';
import { getFromStorage } from '../../utils/localJSONStorage';

describe('actions: setting', () => {
  const dispatch = jest.fn();
  const settings = { autoLog: false };

  afterEach(() => {
    jest.restoreAllMocks();
  });

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

  describe('settingsRetrieved', () => {
    it('should create an action to retrieve settings', () => {
      const initialState = { autoLog: true }

      window.localStorage.getItem = jest.fn(() => JSON.stringify(settings))
      getFromStorage('settings', initialState, async (data) => {
        const expectedAction = {
          data,
          type: actionTypes.settingsRetrieved,
        };

        await settingsRetrieved(data)(dispatch)
        expect(dispatch).toHaveBeenCalledWith(expectedAction);
      })
    })
  })
});
