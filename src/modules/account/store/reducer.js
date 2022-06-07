import { combineReducers } from 'redux';
import actionTypes from './actionTypes';

/**
 *
 * @param {Object} state
 * @param {type: String, accountSchema: Object} action
 */
const current = (state = {}, { type, accountSchema }) => {
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
const list = (state = {}, { type, accountSchema }) => {
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

// eslint-disable-next-line import/prefer-default-export
export const account = combineReducers({ current, list });
