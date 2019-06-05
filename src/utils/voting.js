import i18next from 'i18next';
import votingConst from '../constants/voting';
import Fees from '../constants/fees';

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

const getVotingError = (votes, account) => {
  let error;
  if (account.balance < Fees.vote) {
    error = i18next.t('Not enough LSK to pay for the transaction.');
  } else if (getTotalVotesCount(votes) > votingConst.maxCountOfVotes) {
    error = i18next.t('Max amount of delegates in one voting exceeded.');
  }
  return error;
};

export {
  getTotalVotesCount,
  getVotedList,
  getVoteList,
  getUnvoteList,
  getTotalActions,
  getPendingVotesList,
  getVotingLists,
  getVotingError,
};
