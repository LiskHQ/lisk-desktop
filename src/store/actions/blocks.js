import { actionTypes, ROUND_LENGTH } from '@constants';
import { convertUnixSecondsToLiskEpochSeconds } from '@utils/datetime';
import { getBlocks } from '@api/block';
import { getForgers } from '@api/delegate';

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
export const forgersRetrieved = () => async (dispatch, getState) => {
  const { network, blocks: { latestBlocks } } = getState();
  const forgedInRoundNum = latestBlocks[0].height % ROUND_LENGTH;
  const { data } = await getForgers({
    network,
    params: { limit: ROUND_LENGTH },
  });
  let forgers = [];
  let missedBlocksCount = 0;
  // check previous blocks and define missed blocks
  if (data) {
    forgers = data.map((forger, index) => {
      if (index > forgedInRoundNum) {
        return { ...forger, status: 'awaitingSlot' };
      }
      const { generatorUsername } = latestBlocks[
        latestBlocks.length - forgedInRoundNum + index - missedBlocksCount - 1
      ];
      let status = 'forging';
      if (generatorUsername !== forger.username) {
        status = 'missedBlock';
        missedBlocksCount += 1;
      }
      return {
        ...forger,
        status,
      };
    });
  }
  dispatch({
    type: actionTypes.forgersRetrieved,
    data: forgers,
  });
};

/**
 * Fire this action when a new round starts.
 * It assigns awaitingSlot to all forgers.
 *
 * @param {Array} forgers - List of forgers of the new round
 * @returns {Object} - Action object with type forgersUpdated
 * @todo Check if the list needs modifications
 */
export const forgersUpdated = forgers => ({
  type: actionTypes.forgersUpdated,
  data: forgers.map(forger => ({ ...forger, status: 'awaitingSlot' })),
});

/**
 * Fire this action once a new block is forged.
 * It looks for the delegate who forged the block and
 * marks them as forging. Every delegate who are listed
 * before the actual forger and didn't forge in their turn
 * will be marked as missedBlock.
 *
 * @param {Object} block - Block object containing generatorUsername
 */
export const forgingStatusUpdated = block => async (dispatch, getState) => {
  const { blocks: { forgers, latestBlocks } } = getState();
  const forgedInRoundNum = latestBlocks[0].height % ROUND_LENGTH;
  let found = false;
  const data = forgers.map((forger, index) => {
    if (index >= forgedInRoundNum && !found) {
      if (forger.username === block.generatorUsername) {
        found = true;
        return { ...forger, status: 'forging' };
      }
      return { ...forger, status: 'missedBlock' };
    }
    return forger;
  });


  dispatch({
    type: actionTypes.forgingStatusUpdated,
    data,
  });
};
