import { expect } from 'chai';
import actionTypes from '../constants/actions';
import { forgedBlocksUpdated, forgingStatsUpdated } from './forging';

describe('actions', () => {
  it('should create an action to update forged blocks', () => {
    const data = {
      online: true,
    };

    const expectedAction = {
      data,
      type: actionTypes.forgedBlocksUpdated,
    };
    expect(forgedBlocksUpdated(data)).to.be.deep.equal(expectedAction);
  });

  it('should create an action to update forging stats', () => {
    const data = { last7d: 1000 };

    const expectedAction = {
      data,
      type: actionTypes.forgingStatsUpdated,
    };
    expect(forgingStatsUpdated(data)).to.be.deep.equal(expectedAction);
  });
});
