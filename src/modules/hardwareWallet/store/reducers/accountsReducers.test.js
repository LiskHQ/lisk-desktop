import storeActionTypes from '@account/store/actionTypes';
import { immutableDeleteFromArray } from 'src/utils/immutableUtils';
import { mockHWAccounts } from '../../__fixtures__';
import actionTypes from '../actions/actionTypes';
import { accounts } from './accountsReducers';

describe('reducer: hardware wallet accounts', () => {
  const testHWWalletAccount = {
    hw: {
      path: '20231',
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
      type: actionTypes.setHWAccounts,
      hwAccounts: [...mockHWAccounts, testHWWalletAccount],
    };
    const expectedData = [...state, ...action.hwAccounts];
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

  it('should update hwAccount in list', () => {
    const updatedAccount = {
      ...mockHWAccounts[0],
      metadata: { ...mockHWAccounts[0].metadata, name: 'newName' },
    };
    const action = {
      type: actionTypes.updateHWAccount,
      hwAccount: updatedAccount,
    };

    const updatedState = accounts([mockHWAccounts[0]], action);
    expect(updatedState).toEqual([updatedAccount]);
  });

  it('should remove hw account', () => {
    const accountToRemove = mockHWAccounts[0];
    const action = {
      type: storeActionTypes.deleteAccount,
      address: accountToRemove.metadata.address,
    };

    const expected = immutableDeleteFromArray(mockHWAccounts, 0);

    const updatedState = accounts(mockHWAccounts, action);
    expect(updatedState).toEqual(expected);
  });
});
