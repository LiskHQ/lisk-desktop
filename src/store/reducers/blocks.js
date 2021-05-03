import { actionTypes } from '@constants';

const initialState = {
  latestBlocks: [],
  forgingTimes: {},
  awaitingForgers: [],
  forgers: [],
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
    case actionTypes.forgersRetrieved:
    case actionTypes.forgersUpdated:
    case actionTypes.forgingStatusUpdated:
      return {
        ...state,
        forgers: action.data,
      };
    default:
      return state;
  }
};

export default blocks;
