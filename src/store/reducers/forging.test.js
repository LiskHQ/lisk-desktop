import { expect } from 'chai';
import forging from './forging';
import actionTypes from '../../constants/actions';

describe('Reducer: forging(state, action)', () => {
  let state;
  const blocks = [{
    id: '16113150790072764126',
    timestamp: 36280810,
    height: 29394,
    totalFee: 0,
    reward: 0,
  },
  {
    id: '13838471839278892195',
    version: 0,
    timestamp: 36280700,
    height: 29383,
    totalFee: 0,
    reward: 0,
  },
  {
    id: '5654150596698663763',
    version: 0,
    timestamp: 36279700,
    height: 29283,
    totalFee: 0,
    reward: 0,
  }];

  it('should set forgedBlocks  if action.type = actionTypes.forgedBlocksUpdate and state.forgedBlocks is []', () => {
    state = {
      statistics: {},
      forgedBlocks: [],
    };
    const action = {
      type: actionTypes.forgedBlocksUpdated,
      data: [blocks[0], blocks[1]],
    };
    const changedState = forging(state, action);
    expect(changedState.forgedBlocks).to.deep.equal(action.data);
  });

  it('should prepend forgedBlocks with newer blocks if action.type = actionTypes.forgedBlocksUpdated', () => {
    state = {
      statistics: {},
      forgedBlocks: [blocks[2]],
    };
    const action = {
      type: actionTypes.forgedBlocksUpdated,
      data: [blocks[0], blocks[1]],
    };
    const changedState = forging(state, action);
    expect(changedState.forgedBlocks).to.deep.equal(blocks);
  });

  it('should append forgedBlocks with older blocks if action.type = actionTypes.forgedBlocksUpdated', () => {
    state = {
      statistics: {},
      forgedBlocks: [blocks[0]],
    };
    const action = {
      type: actionTypes.forgedBlocksUpdated,
      data: [blocks[1], blocks[2]],
    };
    const changedState = forging(state, action);
    expect(changedState.forgedBlocks).to.deep.equal(blocks);
  });

  it('should update statistics if action.type = actionTypes.forgingStatsUpdated', () => {
    state = {
      statistics: { last7d: 1000 },
    };
    const action = {
      type: actionTypes.forgingStatsUpdated,
      data: { last24h: 100 },
    };
    const changedState = forging(state, action);
    expect(changedState.statistics).to.deep.equal({ last7d: 1000, last24h: 100 });
  });
});

