import actionTypes from '../../constants/actions';
import voting from '../../constants/voting';

const blocks = (state = { latestBlocks: [] }, action) => {
  switch (action.type) {
    case actionTypes.newBlockCreated:
      return {
        ...state,
        latestBlocks: [
          action.data.block,
          ...state.latestBlocks,
        ].slice(0, voting.numberOfActiveDelegates),
      };
    case actionTypes.olderBlocksRetrieved:
      return {
        ...state,
        latestBlocks: [
          ...state.latestBlocks,
          ...action.blocks.filter(block => (
            block.height < Math.min(...state.latestBlocks.map(b => b.height))
          )),
        ].slice(0, voting.numberOfActiveDelegates),
      };
    default:
      return state;
  }
};

export default blocks;
