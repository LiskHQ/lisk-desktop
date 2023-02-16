import { hwAccounts } from '../../__fixtures__/hwAccounts';
import actionTypes from '../actions/actionTypes';
import { accounts } from './acountsReducers';

describe('reducer: hardware wallet', () => {
  const testHWWalletAccount = {
    hw: {
      deviceId: '20231',
      model: 'Nano S',
      brand: 'Ledger',
    },
    metadata: {
      name: 'masoud123',
      pubkey: 'd08d388725392e3419cce4ac9793259c4e1fbfe7b645b6fad86790b0c37525f2',
      path: '',
      accountIndex: 1,
      isHW: true,
      address: 'lskyyoff8q6cj4jcrpvcm9yquv6anc5qf7rjggm2t',
      creationTime: '2022-12-08T15:30:39.979Z',
    },
    version: 1,
  };
  const state = [];

  it('stores the list of accounts', () => {
    const action = {
      type: actionTypes.storeHWAccounts,
      accounts: [...hwAccounts, testHWWalletAccount],
    };
    const expectedData = { ...state, accounts: [...state.accounts, ...action.accounts] };
    const updatedState = accounts(state, action);
    expect(updatedState).toEqual(expectedData);
  });

  it('removes the list of accounts', () => {
    const action = {
      type: actionTypes.removeHWAccounts,
    };
    const updatedState = accounts(state, action);
    expect(updatedState).toEqual(state);
  });

  it('returns the default list of accounts if invalid action is called', () => {
    const action = {
      type: 'INVALID_ACTION',
    };
    const updatedState = accounts(state, action);
    expect(updatedState).toEqual(state);
  });
});
