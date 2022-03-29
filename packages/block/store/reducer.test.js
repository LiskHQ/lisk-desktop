import { actionTypes } from '@common/configuration';
import blocksReducer from './reducer';
import accounts from '@tests/constants/accounts';

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
    expect(changedBlocks).toEqual({
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
    expect(changedBlocks).toEqual({
      latestBlocks: blocks,
      total: 1000,
    });
  });

  it('stores forgers in the event of forgersRetrieved', () => {
    const state = {
      forgers: [],
      latestBlocks: [],
    };

    const action = {
      type: actionTypes.forgersRetrieved,
      data: {
        forgers: [
          {
            totalVotesReceived: 1e9,
            state: 'awaitingSlot',
            lastBlock: 10000,
            username: accounts.genesis.dpos.delegate.username,
            nextForgingTime: 1620049927,
            address: accounts.genesis.summary.address,
          },
        ],
        indexBook: {
          [accounts.genesis.summary.address]: 0,
        },
      },
    };
    const changedBlocks = blocksReducer(state, action);
    expect(changedBlocks).toEqual({
      latestBlocks: [],
      forgers: action.data.forgers,
      indexBook: action.data.indexBook,
    });
  });
});
