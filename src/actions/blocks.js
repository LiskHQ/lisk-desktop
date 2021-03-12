import { actionTypes, MAX_BLOCKS_FORGED } from 'constants';
import { convertUnixSecondsToLiskEpochSeconds } from 'utils/datetime';
import { getBlocks } from 'utils/api/block';
import { getForgers } from 'utils/api/delegate';

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

  // First we set awaitingForgers as awaitingSlot or missedBlock
  // depending if they are upfront the current round number
  awaitingForgers
    .forEach((item, index) => {
      if (index >= forgedInRoundNum) {
        forgingTimes[item.publicKey] = {
          time: (index - forgedInRoundNum + 1) * 10,
          status: 'awaitingSlot',
          tense: 'future',
        };
      } else {
        forgingTimes[item.publicKey] = {
          time: -1,
          status: 'missedBlock',
          tense: 'past',
        };
      }
    });

  // Now we iterate the latest blocks and if we find some of the ones
  // that we putted on missedBlock we set them to forging
  latestBlocks
    .slice(0, forgedInRoundNum)
    .forEach((item, index) => {
      if (forgingTimes[item.generatorPublicKey]?.status === 'missedBlock') {
        forgingTimes[item.generatorPublicKey] = {
          time: index * 10,
          status: 'forging',
          tense: 'past',
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
