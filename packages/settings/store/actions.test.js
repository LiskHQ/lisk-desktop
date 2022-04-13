import { getFromStorage } from '@common/utilities/localJSONStorage';
import actionTypes from './actionTypes';
import {
  settingsReset,
  settingsUpdated,
  settingsRetrieved,
} from './actions';

describe('actions: setting', () => {
  const dispatch = jest.fn();
  const settings = {
    autoLog: false,
    token: {
      active: 'LSK',
      list: {
        LSK: true,
      },
    },
  };

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('settingsUpdated', () => {
    it('should create an action to update settings', () => {
      // Arrange
      const expectedAction = {
        data: settings,
        type: actionTypes.settingsUpdated,
      };

      // Assert
      expect(settingsUpdated(settings)).toEqual(expectedAction);
    });
  });

  describe('settingsReset', () => {
    it('should create an action to reset settings', () => {
      // Arrange
      const expectedAction = {
        type: actionTypes.settingsReset,
      };

      // Assert
      expect(settingsReset()).toEqual(expectedAction);
    });
  });

  describe('settingsRetrieved', () => {
    it('should create an action to retrieve settings', () => {
      const initialState = { autoLog: true };

      window.localStorage.getItem = jest.fn(() => JSON.stringify(settings));
      getFromStorage('settings', initialState, async (data) => {
        // Arrange
        const expectedAction = {
          data,
          type: actionTypes.settingsRetrieved,
        };

        // Act
        settingsRetrieved()(dispatch);

        // Assert
        expect(dispatch).toHaveBeenCalledWith(expectedAction);
      });
    });
  });
});
