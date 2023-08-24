import { mockHWAccounts } from '@hardwareWallet/__fixtures__';
import { setHWAccounts, removeHWAccounts, updateHWAccount } from './accountsActions';
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

  it('updates an account', () => {
    const hwAccount = { metadata: { isHW: true, name: 'hwAccount' } };
    const expectedAction = {
      type: actionTypes.updateHWAccount,
      hwAccount,
    };
    expect(updateHWAccount(hwAccount)).toEqual(expectedAction);
  });
});
