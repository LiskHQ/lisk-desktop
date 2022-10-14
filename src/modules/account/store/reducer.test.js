import mockSavedAccounts from '@tests/fixtures/accounts';
import actionTypes from './actionTypes';
import { list, current } from './reducer';

describe('Auth reducer', () => {
  it('Should return encryptedAccount if setCurrentAccount action type is triggered', async () => {
    const actionData = {
      type: actionTypes.setCurrentAccount,
      encryptedAccount: mockSavedAccounts[0],
    };
    expect(current({}, actionData)).toEqual(mockSavedAccounts[0]);
  });

  it('Should update encryptedAccount if updateCurrentAccount action type is triggered', async () => {
    const actionData = {
      type: actionTypes.updateCurrentAccount,
      accountDetail: { name: 'testName' },
    };
    const updatedEncryptedAccount = {
      ...mockSavedAccounts[0],
      metadata: { ...mockSavedAccounts[0].metadata, ...{ name: 'testName' } },
    };
    expect(current(mockSavedAccounts[0], actionData)).toEqual(updatedEncryptedAccount);
  });

  it('Should return accounts if addAccount action type is triggered', async () => {
    const actionData = {
      type: actionTypes.addAccount,
      encryptedAccount: mockSavedAccounts[0],
    };
    const expectedState = {
      [mockSavedAccounts[0].metadata.address]: mockSavedAccounts[0],
    };
    expect(list({}, actionData)).toEqual(expectedState);
  });

  it('Should return accounts if updateAccount action type is triggered', async () => {
    const actionData = {
      type: actionTypes.updateAccount,
      encryptedAccount: mockSavedAccounts[0],
      accountDetail: { name: 'testName' },
    };
    const expectedState = {
      [mockSavedAccounts[0].metadata.address]: {
        ...mockSavedAccounts[0],
        metadata: { ...mockSavedAccounts[0].metadata, ...{ name: 'testName' } },
      },
    };
    expect(list({}, actionData)).toEqual(expectedState);
  });

  it('Should return default state if updateAccount action type is triggered with invalid address', async () => {
    const actionData = {
      type: actionTypes.updateAccount,
      encryptedAccount: mockSavedAccounts[1],
      accountDetail: { name: 'testName' },
    };
    const defaultState = mockSavedAccounts[0];
    expect(list(defaultState, actionData)).toEqual(defaultState);
  });

  it('Should remove account while the deleteAccount action is triggered', async () => {
    const actionData = {
      type: actionTypes.deleteAccount,
      address: mockSavedAccounts[0].metadata.address,
    };
    const defaultState = {
      [mockSavedAccounts[0].metadata.address]: mockSavedAccounts[0],
    };
    expect(list(defaultState, actionData)).toEqual({});
  });
});
