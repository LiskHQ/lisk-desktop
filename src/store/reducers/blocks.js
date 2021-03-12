import actionTypes from 'constants';

const initialState = {
  latestBlocks: [],
  forgingTimes: {},
  awaitingForgers: [],
  total: 0,
};

const blocks = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.newBlockCreated:
      return {
        ...state,
        latestBlocks: [
          action.data.block,
          ...state.latestBlocks,
        ].slice(0, 103 * 2),
      };
    case actionTypes.olderBlocksRetrieved:
      return {
        ...state,
        latestBlocks: [
          ...action.data.list,
        ],
        total: action.data.total,
      };
    case actionTypes.forgingTimesRetrieved:
      return {
        ...state,
        forgingTimes: action.data.forgingTimes,
        awaitingForgers: action.data.awaitingForgers,
      };
    default:
      return state;
  }
};

export default blocks;
