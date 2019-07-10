import i18next from 'i18next';
import votingConst from '../constants/voting';
import Fees from '../constants/fees';

export const getVotedList = votes => (Object.keys(votes).filter(key => votes[key].confirmed));

export const getUnvoteList = votes => (Object.keys(votes).filter(key =>
  !votes[key].unconfirmed && votes[key].confirmed));

export const getVoteList = votes => (Object.keys(votes).filter(key =>
  votes[key].unconfirmed && !votes[key].confirmed));

export const getTotalVotesCount = votes => (
  (getVotedList(votes).length - getUnvoteList(votes).length)
  + getVoteList(votes).length
);

export const getTotalActions = votes => (
  Math.ceil((
    getVoteList(votes).length + getUnvoteList(votes).length
  ) / votingConst.maxCountOfVotesInOneTurn)
);

export const getPendingVotesList = votes => (Object.keys(votes).filter(key => votes[key].pending));

export const getVotingLists = votes => ({
  votedList: getVoteList(votes).map(vote => votes[vote].publicKey),
  unvotedList: getUnvoteList(votes).map(vote => votes[vote].publicKey),
});

export const getVotingError = (votes, account) => {
  let error;
  if (account.balance < Fees.vote) {
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
