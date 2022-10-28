import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { storage } from 'src/redux/store';
import actionTypes from './actionTypes';

/**
 *
 * @param {Object} state
 * @param {type: String, encryptedAccount: Object, accountDetail: String} action
 */
export const current = (state = {}, { type, encryptedAccount, accountDetail }) => {
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
    default:
      return state;
  }
};

/**
 *
 * @param {Object} state
 * @param {type: String, encryptedAccount: Object, accountDetail: String, address: string} action
 */
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
    case actionTypes.deleteAccount:
      delete state[address];
      return {
        ...state,
      };
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
