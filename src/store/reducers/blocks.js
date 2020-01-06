import actionTypes from '../../constants/actions';
import voting from '../../constants/voting';

const blocks = (state = { latestBlocks: [], forgingTimes: {} }, action) => {
  switch (action.type) {
    case actionTypes.newBlockCreated:
      return {
        ...state,
        latestBlocks: [
          action.data.block,
          ...state.latestBlocks,
        ].slice(0, voting.numberOfActiveDelegates * 2),
      };
    case actionTypes.olderBlocksRetrieved:
      return {
        ...state,
        latestBlocks: [
          ...action.data,
        ],
      };
    case actionTypes.forgingTimesRetrieved:
      return {
        ...state,
        forgingTimes: action.data,
      };
    default:
      return state;
  }
};

export default blocks;
