import actionTypes from '../constants/actions';
import { MAX_BLOCKS_FORGED } from '../constants/delegates';
import { convertUnixSecondsToLiskEpochSeconds } from '../utils/datetime';
import { getBlocks } from '../utils/api/block';
import { getForgers } from '../utils/api/delegate';

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

// eslint-disable-next-line import/prefer-default-export
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

const retrieveNextForgers = async (network) => {
  const { data } = await getForgers({
    network,
    params: { limit: MAX_BLOCKS_FORGED },
  });

  if (data) {
    return data;
  }

  return [];
};

// eslint-disable-next-line max-statements
export const forgingTimesRetrieved = nextForgers => async (dispatch, getState) => {
  const { network } = getState();
  const { latestBlocks } = getState().blocks;
  const forgedInRoundNum = latestBlocks[0].height % MAX_BLOCKS_FORGED;
  const awaitingForgers = nextForgers ?? await retrieveNextForgers(network);
  const forgingTimes = {};
  // eslint-disable-next-line max-len
  const delegateNames = awaitingForgers.reduce((acc, del) => ({ ...acc, [del.publicKey]: del.username }), {});
  const latestBlock = latestBlocks[0];
  // eslint-disable-next-line no-console
  console.log('Last block genID', delegateNames[latestBlock.generatorPublicKey]);

  // First we iterate the latest blocks and set the forging time
  latestBlocks
    .slice(0, forgedInRoundNum)
    .forEach((item) => {
      if (!forgingTimes[item.generatorPublicKey]) {
        forgingTimes[item.generatorPublicKey] = {
          time: -(latestBlocks[0].timestamp - item.timestamp),
          status: 'forging',
        };
      }
    });

  // Now we set awaitingForgers as awaitingSlot if they are upfront
  // of the current number and to missed block in case that they did
  // not forge
  awaitingForgers
    .forEach((item, index) => {
      if (index >= forgedInRoundNum) {
        forgingTimes[item.publicKey] = {
          time: (index - forgedInRoundNum + 1) * 10,
          status: 'awaitingSlot',
        };
      } else if (!forgingTimes[item.publicKey]) {
        forgingTimes[item.publicKey] = {
          time: false,
          status: 'missedBlock',
        };
      }
    });

  dispatch({
    type: actionTypes.forgingTimesRetrieved,
    data: {
      forgingTimes,
      awaitingForgers,
    },
  });
};
