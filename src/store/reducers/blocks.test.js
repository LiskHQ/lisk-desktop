import { expect } from 'chai';
import blocksReducer from './blocks';
import actionTypes from '../../constants/actions';


describe('Reducer: blocks(state, action)', () => {
  const blocks = [{
    id: 19812401289461240,
    timestamp: 7124087124,
  }, {
    id: 29812401289461240,
    timestamp: 7124087134,
  }];
  const state = {
    latestBlocks: [blocks[1]],
  };

  it('should return blocks object last blocks if action.type = actionTypes.newBlockCreated', () => {
    const action = {
      type: actionTypes.newBlockCreated,
      data: {
        block: blocks[0],
      },
    };
    const changedBlocks = blocksReducer(state, action);
    expect(changedBlocks).to.deep.equal({
      latestBlocks: blocks,
    });
  });
});

