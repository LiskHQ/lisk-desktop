import actionTypes from '../constants/actions';

/**
 * Add data to the list of voted delegates
 */
export const addedToVoteList = data => ({
  type: actionTypes.addedToVoteList,
  data,
});

/**
 * Remove data from the list of voted delegates
 */
export const removedFromVoteList = data => ({
  type: actionTypes.removedFromVoteList,
  data,
});

/**
 * Remove all data from the list of voted delegates and list of unvoted delegates
 */
export const clearVoteLists = () => ({
  type: actionTypes.votesCleared,
});

/**
 * Add pending variable to the list of voted delegates and list of unvoted delegates
 */
export const pendingVotesAdded = () => ({
  type: actionTypes.pendingVotesAdded,
});
