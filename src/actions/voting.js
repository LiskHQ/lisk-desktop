import to from 'await-to-js';
import i18next from 'i18next';
import {
  listAccountDelegates,
  listDelegates,
  vote,
} from '../utils/api/delegate';
import { getTimeOffset } from '../utils/hacks';
import { updateDelegateCache } from '../utils/delegates';
import { voteWithHW } from '../utils/api/hwWallet';
import { passphraseUsed } from './account';
import { addPendingTransaction } from './transactions';
import { errorToastDisplayed } from './toaster';
import Fees from '../constants/fees';
import votingConst from '../constants/voting';
import actionTypes from '../constants/actions';
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

const handleVoteError = ({ error }) => {
  if (error && error.message) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  }
  return i18next.t('An error occurred while placing your vote.');
};

/**
 * Makes Api call to register votes
 * Adds pending state and then after the duration of one round
 * cleans the pending state
 */
export const votePlaced = ({
  passphrase, account, votes, secondPassphrase, callback,
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

    if (account.balance < Fees.vote) {
      dispatch(errorToastDisplayed({
        label: i18next.t('Not enough LSK to pay for the transaction.'),
      }));
      return;
    }
    if (unvotedList.length + votedList > votingConst.maxCountOfVotes) {
      dispatch(errorToastDisplayed({
        label: i18next.t('Max amount of delegates in one voting exceeded.'),
      }));
      return;
    }

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
          await to(voteWithHW(liskAPIClient, account, votedList, unvotedList));
        break;
      /* istanbul ignore next */
      default:
        dispatch({ data: { errorMessage: i18next.t('Login Type not recognized.') }, type: actionTypes.transactionFailed });
    }

    if (error) {
      callback({
        success: false,
        errorMessage: error.message,
        text: handleVoteError({ error }),
      });
    } else {
      dispatch(pendingVotesAdded());
      callResult.map(transaction => dispatch(addPendingTransaction(transaction)));
      dispatch(passphraseUsed(passphrase));
      callback({ success: true });
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
  offset, refresh, q, callback = () => {},
}) =>
  (dispatch, getState) => {
    const liskAPIClient = getState().peers.liskAPIClient;
    let params = {
      offset,
      limit: '101',
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
      callback(response);
    }).catch(callback);
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
