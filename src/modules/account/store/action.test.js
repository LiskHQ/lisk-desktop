import mockSavedAccounts from '@tests/fixtures/accounts';
import actionTypes from './actionTypes';
import {
  setCurrentAccount,
  updateCurrentAccount,
  addAccount,
  updateAccount,
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

  it('should create an action to update current account', () => {
    const expectedAction = {
      type: actionTypes.updateCurrentAccount,
      accountDetail: { name: 'testName' },
    };

    expect(updateCurrentAccount({ name: 'testName' })).toEqual(expectedAction);
  });

  it('should create an action to add account', () => {
    const expectedAction = {
      type: actionTypes.addAccount,
    };

    expect(addAccount()).toEqual(expectedAction);
  });

  it('should create an action to update account', () => {
    const expectedAction = {
      type: actionTypes.updateAccount,
      encryptedAccount: mockSavedAccounts[0],
      accountDetail: { name: 'testName' },
    };

    expect(
      updateAccount({ encryptedAccount: mockSavedAccounts[0], accountDetail: { name: 'testName' } })
    ).toEqual(expectedAction);
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
