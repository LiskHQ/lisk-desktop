import { hwAccounts } from '@hardwareWallet/__fixtures__/hwAccounts';
import { setHWAccounts, removeHWAccounts } from './accountsActions';
import actionTypes from './actionTypes';

describe('actions: hardware wallet', () => {
  it('stores the list of accounts', () => {
    const expectedAction = {
      type: actionTypes.setHWAccounts,
      accounts: hwAccounts,
    };
    expect(setHWAccounts(hwAccounts)).toEqual(expectedAction);
  });
  it('removes the list of accounts', () => {
    const expectedAction = {
      type: actionTypes.removeHWAccounts,
    };
    expect(removeHWAccounts(hwAccounts)).toEqual(expectedAction);
  });
});
