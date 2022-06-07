/* eslint-disable max-lines */
import actionTypes from './actionTypes';
import {
  setCurrentAccount,
  addAccount,
} from './action';

describe('actions:  account', () => {
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

  describe('add account', () => {
    it('should create an action to add account', () => {
      const expectedAction = {
        type: actionTypes.addAccount,
      };

      expect(addAccount()).toEqual(expectedAction);
    });
  });
});
