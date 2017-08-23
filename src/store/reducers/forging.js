import actionTypes from '../../constants/actions';

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const forging = (state = { forgedBlocks: [], statistics: {} }, action) => {
  let startTimestamp;
  let endTimestamp;

  switch (action.type) {
    case actionTypes.forgedBlocksUpdated:
      startTimestamp = state.forgedBlocks && state.forgedBlocks.length ?
        state.forgedBlocks[0].timestamp :
        0;
      endTimestamp = state.forgedBlocks && state.forgedBlocks.length ?
        state.forgedBlocks[state.forgedBlocks.length - 1].timestamp :
        0;
      return Object.assign({}, state, {
        forgedBlocks: [
          ...action.data.filter(block => block.timestamp > startTimestamp),
          ...state.forgedBlocks,
          ...action.data.filter(block => block.timestamp < endTimestamp),
        ],
      });
    case actionTypes.forgingStatsUpdated:
      return Object.assign({}, state, {
        statistics: Object.assign({}, state.statistics, action.data),
      });
    case actionTypes.accountLoggedOut:
      return { forgedBlocks: [], statistics: {} };
    default:
      return state;
  }
};

export default forging;
