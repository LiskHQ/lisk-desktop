import mockSavedAccounts from '@tests/fixtures/accounts';
import actionTypes from './actionTypes';
import { list, current } from './reducer';

describe('Auth reducer', () => {
  it('Should return accountSchema if setCurrentAccount action type is triggered', async () => {
    const actionData = {
      type: actionTypes.setCurrentAccount,
      encryptedAccount: mockSavedAccounts[0],
    };
    expect(current({}, actionData)).toEqual(mockSavedAccounts[0]);
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
});
