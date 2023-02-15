import actionTypes from './actionTypes';
import { storeHWAccounts, removeHWAccounts } from './actions';
import { hwAccounts } from '../../__fixtures__/hwAccounts';

describe('actions: hardware wallet', () => {
  it('stores the list of accounts', () => {
    const expectedAction = {
      type: actionTypes.storeHWAccounts,
      accounts: hwAccounts,
    };
    expect(storeHWAccounts(hwAccounts)).toEqual(expectedAction);
  });
  it('removes the list of accounts', () => {
    const expectedAction = {
      type: actionTypes.removeHWAccounts,
    };
    expect(removeHWAccounts(hwAccounts)).toEqual(expectedAction);
  });
});
