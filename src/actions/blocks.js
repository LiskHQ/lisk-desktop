import actionTypes from '../constants/actions';
import { convertUnixSecondsToLiskEpochSeconds } from '../utils/datetime';
import { tokenMap } from '../constants/tokens';
import liskServiceApi from '../utils/api/lsk/liskService';
import voting from '../constants/voting';
import { getAPIClient } from '../utils/api/network';

/**
 * Retrieves latest blocks from Lisk Service.
 * The iteration of time conversion can be merged
 * into reducer to reduce the big-O factor
 *
 * @param {Object} params - API query parameters
 * @param {Object} networkConfig - Network configuration for mainnet/testnet/devnet
 * @returns {Array} - the list of blocks
 */
const loadLastBlocks = async (params, networkConfig) => {
  let blocks = await liskServiceApi.getLastBlocks({ networkConfig }, params);
  blocks = blocks.map(block => ({
    ...block,
    timestamp: convertUnixSecondsToLiskEpochSeconds(block.timestamp),
  }));
  return blocks;
};

// eslint-disable-next-line import/prefer-default-export
export const olderBlocksRetrieved = () => async (dispatch, getState) => {
  const blocksFetchLimit = 100;
  const networkConfig = getState().network;

  return dispatch({
    type: actionTypes.olderBlocksRetrieved,
    data: [
      ...await loadLastBlocks({ limit: blocksFetchLimit }, networkConfig),
      ...await loadLastBlocks({
        offset: blocksFetchLimit, limit: blocksFetchLimit,
      }, networkConfig),
    ],
  });
};

export const forgingDataDisplayed = () => ({
  type: actionTypes.forgingDataDisplayed,
});

export const forgingDataConcealed = () => ({
  type: actionTypes.forgingDataConcealed,
});

const retrieveNextForgers = async (getState, forgedInRound) => {
  const apiClient = getAPIClient(tokenMap.LSK.key, getState());

  const numberOfRemainingBlocksInRound = voting.numberOfActiveDelegates
    - forgedInRound;
  const nextForgers = await liskServiceApi.getNextForgers(apiClient, {
    limit: Math.min(numberOfRemainingBlocksInRound, 100),
  });

  return nextForgers.slice(0, numberOfRemainingBlocksInRound);
};

// eslint-disable-next-line max-statements
export const forgingTimesRetrieved = () => async (dispatch, getState) => {
  const latestBlocks = getState().blocks.latestBlocks;
  const forgedInRoundNum = latestBlocks[0].height % voting.numberOfActiveDelegates;
  const awaitingForgers = await retrieveNextForgers(getState, forgedInRoundNum);

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
  awaitingForgers.forEach((item, index) => {
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
    data: forgingTimes,
  });
};
