import actionTypes from './actionTypes';
import { settingsReset, settingsUpdated, settingsRetrieved } from './actions';

describe('actions: setting', () => {
  const dispatch = jest.fn();
  const settings = {
    autoLog: false,
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
      // Arrange
      const expectedAction = {
        data: {},
        type: actionTypes.settingsRetrieved,
      };

      // Act
      settingsRetrieved()(dispatch);

      // Assert
      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });
});
