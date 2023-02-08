import { hwAccounts } from '../../__fixtures__/hwAccounts';
import actionTypes from '../actions/actionTypes';
import hardwareWallet from './reducers';

describe('reducer: hardware wallet', () => {
  const state = [];
  it('stores the list of accounts', () => {
    const action = {
      type: actionTypes.storeAccounts,
      accounts: hwAccounts,
    };
    const updatedState = hardwareWallet(state, action);
    expect(updatedState).toEqual(action.accounts);
  });

  it('removes the list of accounts', () => {
    const action = {
      type: actionTypes.removeAccounts,
    };
    const updatedState = hardwareWallet(state, action);
    expect(updatedState).toEqual(state);
  });
});
