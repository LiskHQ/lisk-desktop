import actionTypes from './actionTypes';
import { storeAccounts, removeAccounts } from './actions';
import { hwAccounts } from '../../__fixtures__/hwAccounts';

describe('actions: hardware wallet', () => {
  it('stores the list of accounts', () => {
    const expectedAction = {
      type: actionTypes.storeAccounts,
      accounts: hwAccounts,
    };
    expect(storeAccounts(hwAccounts)).toEqual(expectedAction);
  });
  it('removes the list of accounts', () => {
    const expectedAction = {
      type: actionTypes.removeAccounts,
    };
    expect(removeAccounts(hwAccounts)).toEqual(expectedAction);
  });
});
