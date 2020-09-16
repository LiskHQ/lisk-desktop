import i18next from 'i18next';
import votingConst from '../constants/voting';

/**
 * Returns the list of CONFRIMED votes.
 *
 * @param {Object} votes
 * Votes as stored on the Redux store.
 *
 * @returns {Array} - Array of confirmed vote objects
 */
export const getVotedList = votes => (Object.keys(votes).filter(key => votes[key].confirmed));

/**
 * Returns the list of UNCONFIRMED UNVOTED votes.
 * These delegates are voted on the blockchin, but unvoted locally
 * and yet not submitted to the blockchain.
 *
 * @param {Object} votes
 * Votes as stored on the Redux store.
 *
 * @returns {Array} - Array of unconfirmed vote objects
 */
export const getUnvoteList = votes => (Object.keys(votes).filter(key =>
  !votes[key].unconfirmed && votes[key].confirmed));

/**
 * Returns the list of UNCONFIRMED (UP)VOTED votes.
 * These delegates are not voted on the blockchin, but voted locally
 * and yet not submitted to the blockchain.
 *
 * @param {Object} votes
 * Votes as stored on the Redux store.
 *
 * @returns {Array} - Array of unconfirmed vote objects
 */
export const getVoteList = votes => (Object.keys(votes).filter(key =>
  votes[key].unconfirmed && !votes[key].confirmed));

/**
 * Returns the number of votes after the current unconfirmed
 * votes are submitted and confirmed.
 *
 * @param {Object} votes
 * Votes as stored on the Redux store.
 *
 * @returns {Number} - Number of voted after confirmation of the current changes
 */
export const getTotalVotesCount = votes => (
  (getVotedList(votes).length - getUnvoteList(votes).length)
  + getVoteList(votes).length
);

/**
 * Returns the number of transactions required to submit all the current changes.
 * Which is 1 transaction per 33 votes.
 *
 * @param {Object} votes
 * Votes as stored on the Redux store.
 *
 * @returns {Number} - Returns the number of transactions.
 */
export const getTotalActions = votes => (
  Math.ceil((
    getVoteList(votes).length + getUnvoteList(votes).length
  ) / votingConst.maxCountOfVotesInOneTurn)
);

/**
 * Returns list of votes which are already submitted to the blockchain
 * but not confirmed yet (vote transaction confirmation === 0).
 *
 * @param {Object} votes
 * Votes as stored on the Redux store.
 *
 * @returns {Array} - Returns a list of pending votes objects.
 */
export const getPendingVotesList = votes => (Object.keys(votes).filter(key => votes[key].pending));

export const getVotingLists = votes => ({
  votedList: getVoteList(votes).map(vote => votes[vote].publicKey),
  unvotedList: getUnvoteList(votes).map(vote => votes[vote].publicKey),
});

export const getVotingError = (votes, account) => {
  let error;
  if (account.balance < 1e8) {
    error = i18next.t('Not enough LSK to pay for the transaction.');
  } else if (getTotalVotesCount(votes) > votingConst.maxCountOfVotes) {
    error = i18next.t('Max amount of delegates in one voting exceeded.');
  }
  return error;
};

export const getVote = (votes, name) => votes.find(v => v.username === name);

export const splitVotesIntoRounds = ({ votes, unvotes }) => {
  const rounds = [];
  const maxCountOfVotesInOneTurn = 33;
  while (votes.length + unvotes.length > 0) {
    const votesLength = Math.min(
      votes.length,
      maxCountOfVotesInOneTurn - Math.min(unvotes.length, 16),
    );
    rounds.push({
      votes: votes.splice(0, votesLength),
      unvotes: unvotes.splice(0, maxCountOfVotesInOneTurn - votesLength),
    });
  }
  return rounds;
};
