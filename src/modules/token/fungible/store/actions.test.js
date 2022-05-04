import { getFromStorage } from '@common/utilities/localJSONStorage';
import actionTypes from './actionTypes';
import {
  tokenReset,
  tokenUpdated,
  tokenRetrieved,
} from './actions';

describe('actions: token', () => {
  const dispatch = jest.fn();
  const token = {
    active: 'LSK',
    list: {
      LSK: true,
    },
  };

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('tokenUpdated', () => {
    it('should create an action to update token', () => {
      // Arrange
      const expectedAction = {
        data: token,
        type: actionTypes.tokenUpdated,
      };

      // Assert
      expect(tokenUpdated(token)).toEqual(expectedAction);
    });
  });

  describe('tokenReset', () => {
    it('should create an action to reset token', () => {
      // Arrange
      const expectedAction = {
        type: actionTypes.tokenReset,
      };

      // Assert
      expect(tokenReset()).toEqual(expectedAction);
    });
  });

  describe('tokenRetrieved', () => {
    it('should create an action to retrieve token', () => {
      const initialState = { autoLog: true };

      window.localStorage.getItem = jest.fn(() => JSON.stringify(token));
      getFromStorage('token', initialState, async (data) => {
        // Arrange
        const expectedAction = {
          data,
          type: actionTypes.tokenRetrieved,
        };

        // Act
        tokenRetrieved()(dispatch);

        // Assert
        expect(dispatch).toHaveBeenCalledWith(expectedAction);
      });
    });
  });
});
