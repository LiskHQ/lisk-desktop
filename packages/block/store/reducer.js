import { ROUND_LENGTH } from '@dpos/validator/constants';
import actionTypes from './actionTypes';

const initialState = {
  latestBlocks: [],
  forgers: [],
  indexBook: {},
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
        ].slice(0, ROUND_LENGTH * 2),
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
      return {
        ...state,
        forgers: action.data.forgers,
        indexBook: action.data.indexBook,
      };
    default:
      return state;
  }
};

export default blocks;
