import mockSavedAccounts from '@tests/fixtures/accounts';
import { selectCurrentAccount, selectAccounts } from './selectors';

describe('Auth selector', () => {
  it('Should return encryptedAccount if setCurrentAccount action type is triggered', async () => {
    const state = { account: { current: mockSavedAccounts[0] } };
    expect(selectCurrentAccount(state)).toEqual(mockSavedAccounts[0]);
  });

  it('Should return list of accounts', async () => {
    const list = mockSavedAccounts.reduce((state, account) => {
      state[account.metadata.address] = account;
      return state;
    }, {});
    const state = {
      account: {
        list,
      },
    };

    expect(selectAccounts(state)).toEqual(list);
  });

  it('Should return empty array if no accounts', async () => {
    const state = {
      account: {},
    };

    expect(selectAccounts(state)).toEqual([]);
  });
});
