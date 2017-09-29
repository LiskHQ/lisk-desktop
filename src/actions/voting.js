import { vote, listAccountDelegates, listDelegates } from '../utils/api/delegate';
import { transactionAdded } from './transactions';
import { errorAlertDialogDisplayed } from './dialog';
import { passphraseUsed } from './account';
import actionTypes from '../constants/actions';
import Fees from '../constants/fees';
import transactionTypes from '../constants/transactionTypes';

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
 * Makes Api call to register votes
 * Adds pending state and then after the duration of one round
 * cleans the pending state
 */
export const votePlaced = ({ activePeer, passphrase, account, votes, secondSecret }) =>
  (dispatch) => {
    const votedList = [];
    const unvotedList = [];

    Object.keys(votes).forEach((username) => {
      /* istanbul ignore else */
      if (!votes[username].confirmed && votes[username].unconfirmed) {
        votedList.push(votes[username].publicKey);
      } else if (votes[username].confirmed && !votes[username].unconfirmed) {
        unvotedList.push(votes[username].publicKey);
      }
    });

    vote(
      activePeer,
      passphrase,
      account.publicKey,
      votedList,
      unvotedList,
      secondSecret,
    ).then((response) => {
      // Ad to list
      dispatch(pendingVotesAdded());

      // Add the new transaction
      // @todo Handle alerts either in transactionAdded action or middleware
      dispatch(transactionAdded({
        id: response.transactionId,
        senderPublicKey: account.publicKey,
        senderId: account.address,
        amount: 0,
        fee: Fees.vote,
        type: transactionTypes.vote,
      }));
    }).catch((error) => {
      const text = error && error.message ? `${error.message}.` : 'An error occurred while placing your vote.';
      dispatch(errorAlertDialogDisplayed({ text }));
    });
    dispatch(passphraseUsed(account.passphrase));
  };

/**
 * Gets the list of delegates current account has voted for
 *
 */
export const votesFetched = ({ activePeer, address, type }) =>
  (dispatch) => {
    listAccountDelegates(activePeer, address).then(({ delegates }) => {
      if (type === 'update') {
        dispatch(votesUpdated({ list: delegates }));
      } else {
        dispatch(votesAdded({ list: delegates }));
      }
    });
  };

/**
 * Gets list of all delegates
 */
export const delegatesFetched = ({ activePeer, q, offset, refresh }) =>
  (dispatch) => {
    listDelegates(
      activePeer, {
        offset,
        limit: '100',
        q,
      },
    ).then(({ delegates, totalCount }) => {
      dispatch(delegatesAdded({ list: delegates, totalDelegates: totalCount, refresh }));
    });
  };
