import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';

// eslint-disable-next-line import/prefer-default-export
export const isVotingTxPending = state =>
  state.transactions.pending.some(
    tx => tx.moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.voteDelegate,
  );
