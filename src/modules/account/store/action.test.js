/* eslint-disable max-lines */
import actionTypes from './actionTypes';
import {
  setCurrentAccount,
} from './action';

describe('actions: account', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('current account', () => {
    it('should create an action to set current account', () => {
      const expectedAction = {
        type: actionTypes.setCurrentAccount,
      };

      expect(setCurrentAccount()).toEqual(expectedAction);
    });
  });
});
