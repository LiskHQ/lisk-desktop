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

/**
 * Remove all data from the list of voted delegates and list of unvoted delegates
 *
 */
export const clearVoteLists = () => ({
  type: actionTypes.clearVotes,
});

/**
 * Add pending variable to the list of voted delegates and list of unvoted delegates
 *
 */
export const pendingVotes = () => ({
  type: actionTypes.pendingVotes,
});
