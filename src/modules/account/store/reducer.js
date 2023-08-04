import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { storage } from 'src/redux/store';
import actionTypes from './actionTypes';

export const current = (state = {}, { type, encryptedAccount, accountDetail, address }) => {
  switch (type) {
    case actionTypes.setCurrentAccount:
      return encryptedAccount;
    case actionTypes.updateCurrentAccount:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          ...accountDetail,
        },
      };
    case actionTypes.deleteAccount: {
      const isCurrentAccount = state.metadata?.address === address;

      return isCurrentAccount ? {} : state;
    }
    default:
      return state;
  }
};

export const list = (state = {}, { type, encryptedAccount, accountDetail, address }) => {
  switch (type) {
    case actionTypes.addAccount:
      if (!encryptedAccount?.metadata?.address) {
        return state;
      }
      return {
        ...state,
        [encryptedAccount?.metadata?.address]: encryptedAccount,
      };
    case actionTypes.updateAccount:
      if (!encryptedAccount?.metadata?.address) {
        return state;
      }
      return {
        ...state,
        [encryptedAccount?.metadata?.address]: {
          ...encryptedAccount,
          metadata: {
            ...encryptedAccount?.metadata,
            ...accountDetail,
          },
        },
      };
    case actionTypes.deleteAccount: {
      const { [address]: toRemove, ...updatedState } = state;
      return updatedState;
    }
    default:
      return state;
  }
};

const persistConfig = {
  key: 'account',
  storage,
  whitelist: ['list', 'current'], // only navigation will be persisted
  blacklist: [],
};

const accountReducer = combineReducers({ current, list });

// eslint-disable-next-line import/prefer-default-export
export const account = persistReducer(persistConfig, accountReducer);
