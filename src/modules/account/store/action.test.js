/* eslint-disable max-lines */
import actionTypes from './actionTypes';
import {
  setCurrentAccount,
  addAccount,
  deleteAccount,
} from './action';

describe('actions:  account', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create an action to set current account', () => {
    const expectedAction = {
      type: actionTypes.setCurrentAccount,
    };

    expect(setCurrentAccount()).toEqual(expectedAction);
  });
  it('should create an action to add account', () => {
    const expectedAction = {
      type: actionTypes.addAccount,
    };

    expect(addAccount()).toEqual(expectedAction);
  });

  it('should create an action to delete account', () => {
    const address = 'testAddress';
    const expectedAction = {
      type: actionTypes.deleteAccount,
      address,
    };
    expect(deleteAccount(address)).toEqual(expectedAction);
  });
});
