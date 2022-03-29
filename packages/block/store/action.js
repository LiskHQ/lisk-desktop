import actionTypes from './actionTypes';
import { ROUND_LENGTH } from '@dpos/configuration/delegates';
import { convertUnixSecondsToLiskEpochSeconds } from '@common/utilities/datetime';
import { getBlocks } from '@block/utilities/api';
import { getForgers, getDelegates } from '@dpos/utilities/api';

/**
 * Retrieves latest blocks from Lisk Service.
 * The iteration of time conversion can be merged
 * into reducer to reduce the big-O factor
 *
 * @param {Object} params - API query parameters
 * @param {Object} network - Network configuration for mainnet/testnet/devnet
 * @returns {Array} - the list of blocks
 */
const loadLastBlocks = async (params, network) => {
  const blocks = await getBlocks({ network, params });
  const total = blocks.meta.total;
  return {
    total,
    list: blocks.data.map(block => ({
      ...block,
      timestamp: convertUnixSecondsToLiskEpochSeconds(block.timestamp),
    })),
  };
};

export const olderBlocksRetrieved = () => async (dispatch, getState) => {
  const blocksFetchLimit = 100;
  const { network } = getState();

  const batch1 = await loadLastBlocks({ limit: blocksFetchLimit }, network);
  const batch2 = await loadLastBlocks({
    offset: blocksFetchLimit, limit: blocksFetchLimit,
  }, network);

  return dispatch({
    type: actionTypes.olderBlocksRetrieved,
    data: {
      list: [
        ...batch1.list,
        ...batch2.list,
      ],
      total: batch1.total,
    },
  });
};

/**
 * Fire this action after network is set.
 * It retrieves the list of forgers in the current
 * round and determines their status as forging, missedBlock
 * and awaitingSlot.
 */
// eslint-disable-next-line max-statements
export const forgersRetrieved = () => async (dispatch, getState) => {
  const { network, blocks: { latestBlocks } } = getState();
  const forgedBlocksInRound = latestBlocks[0].height % ROUND_LENGTH;
  const remainingBlocksInRound = ROUND_LENGTH - forgedBlocksInRound;
  const { data } = await getForgers({
    network,
    params: { limit: ROUND_LENGTH },
  });
  let forgers = [];
  const indexBook = {};

  // Get the list of usernames that already forged in this round
  const haveForgedInRound = latestBlocks
    .filter((b, i) => forgedBlocksInRound >= i)
    .map(b => b.generatorUsername);

  // check previous blocks and define missed blocks
  if (data) {
    const delegates = await getDelegates({
      network: network.networks.LSK,
      params: { addressList: data.map(forger => forger.address) },
    });

    forgers = data.map((forger, index) => {
      forger.rank = delegates.data.find(
        delegate => forger.address === delegate.summary.address,
      )?.dpos?.delegate?.rank;
      indexBook[forger.address] = index;
      if (haveForgedInRound.indexOf(forger.username) > -1) {
        return { ...forger, state: 'forging' };
      }
      if (index < remainingBlocksInRound) {
        return { ...forger, state: 'awaitingSlot' };
      }
      return { ...forger, state: 'missedBlock' };
    });
  }

  dispatch({
    type: actionTypes.forgersRetrieved,
    data: {
      forgers,
      indexBook,
    },
  });
};
