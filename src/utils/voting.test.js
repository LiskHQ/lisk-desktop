import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { isVotingTxPending } from './voting';

describe('Voting utils', () => {
  describe('Voting utils', () => {
    const state = {
      transactions: {
        pending: [],
      },
    };
    it('should return true', () => {
      state.transactions.pending = [
        { moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.voteDelegate },
      ];
      expect(isVotingTxPending(state)).toEqual(true);
      state.transactions.pending = [
        { moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.transfer },
        { moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.voteDelegate },
      ];
      expect(isVotingTxPending(state)).toEqual(true);
    });

    it('should return false', () => {
      state.transactions.pending = [];
      expect(isVotingTxPending(state)).toEqual(false);
      state.transactions.pending = [{ moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.transfer }];
      expect(isVotingTxPending(state)).toEqual(false);
    });
  });
});
