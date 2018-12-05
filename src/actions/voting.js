import to from 'await-to-js';
import i18next from 'i18next';
import {
  listAccountDelegates,
  listDelegates,
  vote,
} from '../utils/api/delegate';
import { getTimeOffset } from '../utils/hacks';
import { updateDelegateCache } from '../utils/delegates';
import { voteWithLedger } from '../utils/api/ledger';
import { passphraseUsed } from './account';
import { transactionAdded } from './transactions';
import Fees from '../constants/fees';
import actionTypes from '../constants/actions';
import transactionTypes from '../constants/transactionTypes';
import { loginType } from '../constants/hwConstants';

/**
 * Add pending variable to the list of voted delegates and list of unvoted delegates
 */
export const pendingVotesAdded = () => ({
  type: actionTypes.pendingVotesAdded,
});

/**
 * Remove all data from the list of voted delegates and list of unvoted delegates
 */
export const votesUpdated = data => ({
  type: actionTypes.votesUpdated,
  data,
});

/**
 * Add data to the list of voted delegates
 */
export const votesAdded = data => ({
  type: actionTypes.votesAdded,
  data,
});

/**
 * Add data to the list of all delegates
 */
export const delegatesAdded = data => ({
  type: actionTypes.delegatesAdded,
  data,
});

/**
 * Toggles account's vote for the given delegate
 */
export const voteToggled = data => ({
  type: actionTypes.voteToggled,
  data,
});


/**
 * Updates vote lookup status of the given delegate name
 */
export const voteLookupStatusUpdated = data => ({
  type: actionTypes.voteLookupStatusUpdated,
  data,
});

/**
 * Clears all vote lookup statuses
 */
export const voteLookupStatusCleared = () => ({
  type: actionTypes.voteLookupStatusCleared,
});

export const clearVotes = () => ({
  type: actionTypes.votesCleared,
});

const handleVoteError = ({ error, account }) => {
  let text;
  switch (account.loginType) {
    case loginType.normal:
      text = error && error.message ? `${error.message}.` : i18next.t('An error occurred while placing your vote.');
      break;
    /* istanbul ignore next */
    case loginType.ledger:
      text = i18next.t('You have cancelled voting on your hardware wallet. You can either continue or retry.');
      break;
    /* istanbul ignore next */
    default:
      text = error.message;
  }
  return text;
};

/**
 * Makes Api call to register votes
 * Adds pending state and then after the duration of one round
 * cleans the pending state
 */
export const votePlaced = ({
  passphrase, account, votes, secondPassphrase, goToNextStep,
}) =>
  async (dispatch, getState) => { // eslint-disable-line max-statements
    // account.loginType = 1;
    let error;
    let callResult;
    const liskAPIClient = getState().peers.liskAPIClient;
    const votedList = [];
    const unvotedList = [];
    const timeOffset = getTimeOffset(getState());
    Object.keys(votes).forEach((username) => {
      /* istanbul ignore else */
      if (!votes[username].confirmed && votes[username].unconfirmed) {
        votedList.push(votes[username].publicKey);
      } else if (votes[username].confirmed && !votes[username].unconfirmed) {
        unvotedList.push(votes[username].publicKey);
      }
    });

    switch (account.loginType) {
      case loginType.normal:
        [error, callResult] = await to(vote(
          liskAPIClient, passphrase, account.publicKey,
          votedList, unvotedList, secondPassphrase, timeOffset,
        ));
        break;
      /* istanbul ignore next */
      // eslint-disable-next-line no-case-declarations
      case loginType.ledger:
        [error, callResult] =
          await to(voteWithLedger(liskAPIClient, account, votedList, unvotedList));
        break;
      /* istanbul ignore next */
      default:
        dispatch({ data: { errorMessage: i18next.t('Login Type not recognized.') }, type: actionTypes.transactionFailed });
    }

    if (error) {
      goToNextStep({ success: false, text: handleVoteError({ error, account, dispatch }) });
    } else {
      dispatch(pendingVotesAdded());
      dispatch(transactionAdded({
        id: callResult.id,
        senderPublicKey: account.publicKey,
        senderId: account.address,
        amount: 0,
        fee: Fees.vote,
        type: transactionTypes.vote,
      }));
      dispatch(passphraseUsed(passphrase));
      goToNextStep({ success: true });
    }
  };

/**
 * Gets the list of delegates current account has voted for
 *
 */
export const votesFetched = ({ address, type }) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    listAccountDelegates(liskAPIClient, address).then((response) => {
      if (type === 'update') {
        dispatch(votesUpdated({ list: response.data.votes }));
      } else {
        dispatch(votesAdded({ list: response.data.votes }));
      }
    });
  };

/**
 * Gets list of all delegates
 */
export const delegatesFetched = ({
  offset, refresh, q,
}) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    let params = {
      offset,
      limit: '100',
      sort: 'rank:asc',
    };
    params = q ? { ...params, search: q } : params;
    listDelegates(liskAPIClient, params).then((response) => {
      updateDelegateCache(response.data, getState().peers);
      dispatch(delegatesAdded({
        list: response.data,
        totalDelegates: response.data.length,
        refresh,
      }));
    });
  };


/**
 * Get list of delegates current account has voted for and dispatch it with votes from url
 */
export const urlVotesFound = ({
  upvotes, unvotes, address,
}) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    const processUrlVotes = (votes) => {
      dispatch(votesAdded({ list: votes, upvotes, unvotes }));
    };
    listAccountDelegates(liskAPIClient, address)
      .then((response) => { processUrlVotes(response.data.votes); })
      .catch(() => { processUrlVotes([]); });
  };
