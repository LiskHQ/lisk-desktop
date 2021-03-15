import { expect } from 'chai';
import actionTypes from '@constants';
import blocksReducer from './blocks';


describe('Reducer: blocks(state, action)', () => {
  const blocks = [{
    id: 19812401289461240,
    timestamp: 7124087134,
    height: 123457,
  }, {
    id: 29812401289461240,
    timestamp: 7124087124,
    height: 123456,
  }];
  it('should return blocks object last blocks if action.type = actionTypes.newBlockCreated', () => {
    const state = {
      latestBlocks: [blocks[1]],
    };

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

  it('should action.blocks to state.latestBlocks if action.type = actionTypes.olderBlocksRetrieved', () => {
    const state = {
      latestBlocks: [blocks[0]],
    };

    const action = {
      type: actionTypes.olderBlocksRetrieved,
      data: {
        list: blocks,
        total: 1000,
      },
    };
    const changedBlocks = blocksReducer(state, action);
    expect(changedBlocks).to.deep.equal({
      latestBlocks: blocks,
      total: 1000,
    });
  });

  it('stores forgingTimes in the event of forgingTimesRetrieved', () => {
    const state = {
      latestBlocks: [],
      forgingTimes: {},
    };

    const action = {
      type: actionTypes.forgingTimesRetrieved,
      data: {
        forgingTimes: ['12345678', { time: 0, status: 'forging', tense: 'past' }],
        awaitingForgers: [{ address: '12345678', publicKey: '12345678', username: 'test' }],
      },
    };
    const changedBlocks = blocksReducer(state, action);
    expect(changedBlocks).to.deep.equal({
      latestBlocks: [],
      forgingTimes: action.data.forgingTimes,
      awaitingForgers: action.data.awaitingForgers,
    });
  });
});
