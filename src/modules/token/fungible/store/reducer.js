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
const token = (state = initialState) => state;

export default token;
