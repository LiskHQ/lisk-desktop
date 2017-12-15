import { mock } from 'sinon';
import savedAccounts from './savedAccounts';
import * as savedAccountsUtils from '../../utils/savedAccounts';

describe('Subscriber: savedAccounts(state)', () => {
  const account = {
    publicKey: 'sample_key_1',
    network: 'Custom node',
    address: 'http://localhost:4000',
  };
  const account2 = {
    publicKey: 'sample_key_2',
    network: 'Custom node',
    address: 'http://localhost:4000',
  };
  let savedAccountsUtilsMock;

  beforeEach(() => {
    savedAccountsUtilsMock = mock(savedAccountsUtils);
  });

  afterEach(() => {
    savedAccountsUtilsMock.verify();
  });

  it('should call setSavedAccounts and setLastActiveAccount if state.savedAccounts.lastActive', () => {
    const state = {
      savedAccounts: {
        accounts: [account, account2],
        lastActive: account,
      },
    };
    const store = {
      getState: () => state,
    };
    savedAccountsUtilsMock.expects('setSavedAccounts').withArgs(state.savedAccounts.accounts);
    savedAccountsUtilsMock.expects('setLastActiveAccount').withArgs(state.savedAccounts.lastActive);
    savedAccounts(store);
  });

  it('should do nothing if !state.savedAccounts.lastActive', () => {
    const state = {
      savedAccounts: {
        accounts: [],
      },
    };
    const store = {
      getState: () => state,
    };
    savedAccounts(store);
  });
});

