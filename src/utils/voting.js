
const getVotedList = votes => (Object.keys(votes).filter(key => votes[key].confirmed));

const getUnvoteList = votes => (Object.keys(votes).filter(key =>
  !votes[key].unconfirmed && votes[key].confirmed));

const getVoteList = votes => (Object.keys(votes).filter(key =>
  votes[key].unconfirmed && !votes[key].confirmed));

const getTotalVotesCount = votes => ((getVotedList(votes).length - getUnvoteList(votes).length)
  + getVoteList(votes).length);

const getVoteClass = (voteStatus, styles) => {
  if (!voteStatus) {
    return '';
  }
  const { pending, confirmed, unconfirmed } = voteStatus;
  if (pending) {
    return 'pendingRow';
  } else if (confirmed !== unconfirmed) {
    return confirmed ? `${styles.downVoteRow} selected-row` : `${styles.upVoteRow} selected-row`;
  }
  return confirmed ? styles.votedRow : '';
};

export { getTotalVotesCount, getVotedList, getVoteList, getUnvoteList, getVoteClass };
