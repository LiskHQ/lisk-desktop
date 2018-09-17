import { expect } from 'chai';
import Lisk from 'lisk-elements';
import { getTimeOffset } from './hacks';

describe('hack utils', () => {
  describe('getTimeOffset', () => {
    it('should return time offset to timestamp of the last block', () => {
      const offset = 12;
      const state = {
        blocks: {
          latestBlocks: [{
            timestamp: Lisk.transaction.utils.getTimeFromBlockchainEpoch() - offset,
          }],
        },
      };
      expect(getTimeOffset(state)).to.equal(-offset);
    });
  });
});
