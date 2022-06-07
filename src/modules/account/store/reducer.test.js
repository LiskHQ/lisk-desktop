import mockSavedAccounts from '@tests/fixtures/accounts';
import actionTypes from './actionTypes';
import { account } from './reducer';

jest.mock('redux', () => ({
  combineReducers: jest.fn((reducers) => reducers),
}));

describe('Auth reducer', () => {
  it('Should return accountSchema if setCurrentAccount action type is triggered', async () => {
    const actionData = {
      type: actionTypes.setCurrentAccount,
      accountSchema: mockSavedAccounts[0],
    };
    expect(account.current({}, actionData)).toEqual(mockSavedAccounts[0]);
  });

  it('Should return accounts if addAccount action type is triggered', async () => {
    const actionData = {
      type: actionTypes.addAccount,
      accountSchema: mockSavedAccounts[0],
    };
    const expectedState = {
      [mockSavedAccounts[0].metadata.address]: mockSavedAccounts[0],
    };
    expect(account.list({}, actionData)).toEqual(expectedState);
  });
});
