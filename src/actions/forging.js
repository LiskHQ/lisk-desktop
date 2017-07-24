import actionTypes from '../constants/actions';

export const updateForgedBlocks = data => ({
  data,
  type: actionTypes.forgedBlocksUpdated,
});

export const updateForgingStats = data => ({
  data,
  type: actionTypes.forgingStatsUpdated,
});
