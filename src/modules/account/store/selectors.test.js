import mockSavedAccounts from '@tests/fixtures/accounts';
import { selectCurrentAccount } from './selectors';

describe('Auth middleware', () => {
  it('Should return accountSchema if setCurrentAccount action type is tiggered', async () => {
    const state = { account: { current: mockSavedAccounts[0] } };
    expect(selectCurrentAccount(state)).toEqual(mockSavedAccounts[0]);
  });
});
