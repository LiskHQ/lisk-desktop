import i18next from 'i18next';

import Fees from '../constants/fees';
import localJSONStorage from './localJSONStorage';
import votingConst from '../constants/voting';

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

export const getPersistedVotes = address => localJSONStorage.get(`votes-${address}`, {});

export const addPersistedVotes = (address, votesList) => {
  const votesDict = getPersistedVotes(address);
  return votesList.map(vote => ({
    ...vote,
    unconfirmed: votesDict[vote.username] ? votesDict[vote.username].unconfirmed : true,
    confirmed: votesDict[vote.username] ? votesDict[vote.username].confirmed : true,
  })).concat(Object.keys(votesDict)
    .filter(username => votesDict[username].unconfirmed)
    .map(username => ({ username, ...votesDict[username] })));
};

export const persistVotes = (address, votes) => {
  localJSONStorage.set(
    `votes-${address}`,
    Object.keys(votes).reduce((accumulator, key) => {
      if (votes[key].unconfirmed !== votes[key].confirmed) {
        accumulator[key] = votes[key];
      }
      return accumulator;
    }, {}),
  );
};
