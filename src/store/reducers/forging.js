import actionTypes from '../../constants/actions';

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
const forging = (state = { forgedBlocks: [], statistics: {} }, action) => {
  switch (action.type) {
    case actionTypes.forgedBlocksUpdated:
      return Object.assign({}, state, {
        forgedBlocks: (state.forgedBlocks || []).concat(action.data),
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
