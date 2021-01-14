const votingConst = {
  maxCountOfVotesInOneTurn: 33,
  maxCountOfVotes: 101,
  // numberOfActiveDelegates is separate from maxCountOfVotes because it will change:
  // https://github.com/LiskHQ/lips/blob/master/proposals/lip-0021.md
  numberOfActiveDelegates: 103,
  fee: 1,
};

export default votingConst;
