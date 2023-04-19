import { mockHWAccounts } from '@hardwareWallet/__fixtures__';
import { setHWAccounts, removeHWAccounts } from './accountsActions';
import actionTypes from './actionTypes';

describe('actions: hardware wallet', () => {
  it('stores the list of accounts', () => {
    const expectedAction = {
      type: actionTypes.setHWAccounts,
      hwAccounts: mockHWAccounts,
    };
    expect(setHWAccounts(mockHWAccounts)).toEqual(expectedAction);
  });
  it('removes the list of accounts', () => {
    const expectedAction = {
      type: actionTypes.removeHWAccounts,
    };
    expect(removeHWAccounts(mockHWAccounts)).toEqual(expectedAction);
  });
});
