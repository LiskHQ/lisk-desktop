import votingConst from '../constants/voting';

const getVotedList = votes => (Object.keys(votes).filter(key => votes[key].confirmed));

const getUnvoteList = votes => (Object.keys(votes).filter(key =>
  !votes[key].unconfirmed && votes[key].confirmed));

const getVoteList = votes => (Object.keys(votes).filter(key =>
  votes[key].unconfirmed && !votes[key].confirmed));

const getTotalVotesCount = votes => ((getVotedList(votes).length - getUnvoteList(votes).length)
  + getVoteList(votes).length);

const getTotalActions = votes => (
  Math.ceil((
    getVoteList(votes).length + getUnvoteList(votes).length
  ) / votingConst.maxCountOfVotesInOneTurn)
);

const getPendingVotesList = votes => (Object.keys(votes).filter(key => votes[key].pending));

const getVotingLists = votes => ({
  votedList: getVoteList(votes).map(vote => votes[vote].publicKey),
  unvotedList: getUnvoteList(votes).map(vote => votes[vote].publicKey),
});

export {
  getTotalVotesCount,
  getVotedList,
  getVoteList,
  getUnvoteList,
  getTotalActions,
  getPendingVotesList,
  getVotingLists,
};
