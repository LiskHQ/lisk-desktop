import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { storage } from '../../../../packages/common/store/index';
import actionTypes from './actionTypes';

/**
 *
 * @param {Object} state
 * @param {type: String, accountSchema: Object} action
 */
export const current = (state = {}, { type, accountSchema }) => {
  switch (type) {
    case actionTypes.setCurrentAccount:
      return accountSchema;
    default:
      return state;
  }
};

/**
 *
 * @param {Object} state
 * @param {type: String, accountSchema: Object} action
 */
export const list = (state = {}, { type, accountSchema }) => {
  switch (type) {
    case actionTypes.addAccount:
      if (!accountSchema?.metadata?.address) {
        return state;
      }
      return {
        ...state,
        [accountSchema?.metadata?.address]: accountSchema,
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
