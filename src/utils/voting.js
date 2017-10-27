
const getVotedList = votes => (Object.keys(votes).filter(key => votes[key].confirmed));

const getUnvoteList = votes => (Object.keys(votes).filter(
  key => !votes[key].unconfirmed && votes[key].confirmed));

const getVoteList = votes => (Object.keys(votes).filter(
  key => votes[key].unconfirmed && !votes[key].confirmed));

const getTotalVotesCount = votes => ((getVotedList(votes).length - getUnvoteList(votes).length)
  + getVoteList(votes).length);

const getNewVotesCount = votes => (Object.keys(votes).filter(
  key => ((votes[key].confirmed !== votes[key].unconfirmed)),
)).length;

export { getNewVotesCount, getTotalVotesCount, getVotedList, getVoteList, getUnvoteList };
