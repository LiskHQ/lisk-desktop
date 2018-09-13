import actionTypes from '../../constants/actions';

const blocks = (state = { latestBlocks: [] }, action) => {
  switch (action.type) {
    case actionTypes.newBlockCreated:
      return {
        ...state,
        latestBlocks: [
          action.data.block,
          ...state.latestBlocks.slice(0, 9),
        ],
      };
    default:
      return state;
  }
};

export default blocks;
