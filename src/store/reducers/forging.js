import actionTypes from '../../constants/actions';

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const forging = (state = { forgedBlocks: [], statistics: {} }, action) => {
  let startTimesamp;
  let endTimesamp;

  switch (action.type) {
    case actionTypes.forgedBlocksUpdated:
      startTimesamp = state.forgedBlocks.length ? state.forgedBlocks[0].timestamp : 0;
      endTimesamp = state.forgedBlocks.length ?
        state.forgedBlocks[state.forgedBlocks.length - 1].timestamp :
        0;
      return Object.assign({}, state, {
        forgedBlocks: [
          ...action.data.filter(block => block.timestamp > startTimesamp),
          ...state.forgedBlocks,
          ...action.data.filter(block => block.timestamp < endTimesamp),
        ],
      });
    case actionTypes.forgingStatsUpdated:
      return Object.assign({}, state, {
        statistics: Object.assign({}, state.statistics, action.data),
      });
    default:
      return state;
  }
};

export default forging;
