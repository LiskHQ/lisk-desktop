import mockSavedAccounts from '@tests/fixtures/accounts';
import actionTypes from './actionTypes';
import { account } from './reducer';

jest.mock('redux', () => ({
  combineReducers: jest.fn((reducers) => reducers),
}));

const actionData = {
  type: actionTypes.setCurrentAccount,
  accountSchema: mockSavedAccounts[0],
};

describe('Auth middleware', () => {
  it('Should return accountSchema if setCurrentAccount action type is tiggered', async () => {
    expect(account.current({}, actionData)).toEqual(mockSavedAccounts[0]);
  });
});
