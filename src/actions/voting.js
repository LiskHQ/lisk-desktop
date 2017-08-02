import actionTypes from '../constants/actions';

/**
 * Add data to the list of voted delegates
 *
 */
export const addToVoteList = data => ({
  type: actionTypes.addToVoteList,
  data,
});

/**
 * Remove data from the list of voted delegates
 *
 */
export const removeFromVoteList = data => ({
  type: actionTypes.removeFromVoteList,
  data,
});
