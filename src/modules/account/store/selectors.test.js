import mockSavedAccounts from '@tests/fixtures/accounts';
import { selectCurrentAccount, selectAccounts } from './selectors';

describe('Auth selector', () => {
  it('Should return encryptedAccount if setCurrentAccount action type is tiggered', async () => {
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
});
