import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { storage } from '../../../../packages/common/store/index';
import actionTypes from './actionTypes';

/**
 *
 * @param {Object} state
 * @param {type: String, encryptedAccount: Object} action
 */
export const current = (state = {}, { type, encryptedAccount }) => {
  switch (type) {
    case actionTypes.setCurrentAccount:
      return encryptedAccount;
    default:
      return state;
  }
};

/**
 *
 * @param {Object} state
 * @param {type: String, encryptedAccount: Object, address: string} action
 */
export const list = (state = {}, { type, encryptedAccount, address }) => {
  switch (type) {
    case actionTypes.addAccount:
      if (!encryptedAccount?.metadata?.address) {
        return state;
      }
      return {
        ...state,
        [encryptedAccount?.metadata?.address]: encryptedAccount,
      };
    case actionTypes.removeAccount:
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
  whitelist: ['list'], // only navigation will be persisted
  blacklist: ['current'],
};

const accountReducer = combineReducers({ current, list });

// eslint-disable-next-line import/prefer-default-export
export const account = persistReducer(persistConfig, accountReducer);
