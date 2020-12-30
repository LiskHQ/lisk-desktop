import actionTypes from '../constants/actions';
import { convertUnixSecondsToLiskEpochSeconds } from '../utils/datetime';
import voting from '../constants/voting';
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

const retrieveNextForgers = async (getState, forgedInRound) => {
  const { network } = getState();

  const numberOfRemainingBlocksInRound = voting.numberOfActiveDelegates
    - forgedInRound;
  const { data } = await getForgers({
    network,
    params: { limit: Math.min(numberOfRemainingBlocksInRound, 101) },
  });

  if (data) {
    return data.slice(0, numberOfRemainingBlocksInRound);
  }

  return [];
};

// eslint-disable-next-line max-statements
export const forgingTimesRetrieved = () => async (dispatch, getState) => {
  const { latestBlocks } = getState().blocks;
  const forgedInRoundNum = latestBlocks[0].height % voting.numberOfActiveDelegates;
  const awaitingForgers = await retrieveNextForgers(getState, 0);

  // First I define the delegates who forged in this round.
  // Their status is forging with no doubt
  const forgingTimes = latestBlocks
    .filter((_, i) => i <= forgedInRoundNum)
    .reduce((acc, item, index) => {
      acc[item.generatorPublicKey] = {
        time: (index + 1) * 10,
        status: 'forging',
        tense: 'past',
      };
      return acc;
    }, {});
  // Then I have to figure out which ones forged
  // last round and which ones did the round before
  latestBlocks.forEach((item, index) => {
    if (index > forgedInRoundNum && !forgingTimes[item.generatorPublicKey]) {
      // if I can't find it in the previous round
      if (index >= forgedInRoundNum + 101 && latestBlocks.indexOf(item) === index) {
        forgingTimes[item.generatorPublicKey] = {
          time: (index + 1) * 10,
          status: 'missedBlock',
          tense: 'past',
        };
      } else {
        forgingTimes[item.generatorPublicKey] = {
          time: (index + 1) * 10,
          status: 'awaitingSlot',
          tense: 'past',
        };
      }
    }
  });
  // now from the list of forgers, they're all awaiting slot,
  // unless they didn't forge for in the last 2 rounds.
  awaitingForgers.filter((item, index) => index < forgedInRoundNum).forEach((item, index) => {
    if (forgingTimes[item.publicKey]) {
      forgingTimes[item.publicKey] = {
        time: index * 10,
        status: 'awaitingSlot',
        tense: 'future',
      };
    } else {
      forgingTimes[item.publicKey] = {
        time: -1,
        status: 'notForging',
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
