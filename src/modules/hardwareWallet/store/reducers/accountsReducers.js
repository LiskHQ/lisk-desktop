import { imDeleteFromArray, imSetToArray } from 'src/utils/immutableUtils';
import storeActionTypes from '@account/store/actionTypes';
import actionTypes from '../actions/actionTypes';

const initAccounts = [];

export const accounts = (
  state = initAccounts,
  { type, hwAccounts = initAccounts, hwAccount, address: addressToDelete }
) => {
  switch (type) {
    case actionTypes.setHWAccounts: {
      return hwAccounts;
    }
    case actionTypes.removeHWAccounts: {
      return initAccounts;
    }
    case actionTypes.updateHWAccount: {
      const indexToUpdate = state.findIndex(
        (account) => account.metadata.address === hwAccount.metadata.address
      );
      return imSetToArray({ array: state, mapToAdd: hwAccount, index: indexToUpdate });
    }
    case storeActionTypes.deleteAccount: {
      const indexToDelete = state.findIndex(
        (account) => account.metadata.address === addressToDelete
      );
      return imDeleteFromArray(state, indexToDelete);
    }
    default:
      return state;
  }
};
