import { tokenMap } from '@token/fungible/consts/tokens';
import { deepMergeObj } from '@common/utilities/helpers';
import actionTypes from './actionTypes';

export const initialState = {
  active: tokenMap.LSK.key,
  list: {
    [tokenMap.LSK.key]: true,
  },
};

/**
 * Function to validate that the active token is enabled on the settings, otherwise
 * sets the default token to LSK.
 * @param {Object} state
 * @returns {Object} -> state with correct active token.
 */
const validateToken = state => (
  state.token && !state.token.list[state.token.active]
    ? { ...state, token: { active: tokenMap.LSK.key, list: state.token.list } }
    : state
);

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const token = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.tokenRetrieved: {
      return validateToken(action.data);
    }
    case actionTypes.tokenUpdated:
      return validateToken(deepMergeObj(state, action.data));
    case actionTypes.tokenReset:
      return state;
    default:
      return state;
  }
};

export default token;
