import { olderBlocksRetrieved } from './blocks';
import actionTypes from '../constants/actions';
import blocks from '../../test/constants/blocks';


describe('actions: blocks', () => {
  describe('olderBlocksRetrieved', () => {
    it('should create an action to store olderBlocks', () => {
      const expectedAction = {
        blocks,
        type: actionTypes.olderBlocksRetrieved,
      };
      expect(olderBlocksRetrieved({ blocks })).toEqual(expectedAction);
    });
  });
});
