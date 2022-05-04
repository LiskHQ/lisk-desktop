import { tokenMap } from '@token/fungible/consts/tokens';

export const initialState = {
  active: tokenMap.LSK.key,
  list: {
    [tokenMap.LSK.key]: true,
  },
};

/**
 * @todo - Update token reducer based on new token retrieval structure
 * @param {Array} state
 * @param {Object} action
 */
// eslint-disable-next-line no-unused-vars
const token = (state = initialState, action) => state;

export default token;
