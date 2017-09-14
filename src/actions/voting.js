import actionTypes from '../constants/actions';
import { vote } from '../utils/api/delegate';
import { transactionAdded } from './transactions';
import { errorAlertDialogDisplayed } from './dialog';
import Fees from '../constants/fees';

/**
 * Add pending variable to the list of voted delegates and list of unvoted delegates
 */
export const pendingVotesAdded = () => ({
  type: actionTypes.pendingVotesAdded,
});

/**
 * Remove all data from the list of voted delegates and list of unvoted delegates
 */
export const clearVoteLists = () => ({
  type: actionTypes.votesCleared,
});

/**
 *
 */
export const votePlaced = ({ activePeer, account, votedList, unvotedList, secondSecret }) =>
  (dispatch) => {
    // Make the Api call
    vote(
      activePeer,
      account.passphrase,
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
        type: 3,
      }));
    })
    .catch((error) => {
      const text = error && error.message ? `${error.message}.` : 'An error occurred while placing your vote.';
      dispatch(errorAlertDialogDisplayed({ text }));
    });
  };

/**
 * Add data to the list of voted delegates
 */
export const addedToVoteList = data => ({
  type: actionTypes.addedToVoteList,
  data,
});

/**
 * Remove data from the list of voted delegates
 */
export const removedFromVoteList = data => ({
  type: actionTypes.removedFromVoteList,
  data,
});
