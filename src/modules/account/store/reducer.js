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

// eslint-disable-next-line import/prefer-default-export
export const account = combineReducers({ current });
