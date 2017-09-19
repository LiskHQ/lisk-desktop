import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import style from './votingBar.css';

const VotingBar = ({ votes }) => {
  const voteMaxCount = 33;
  const votedMaxCount = 101;
  const votedList = Object.keys(votes).filter(key => votes[key].confirmed);
  const voteList = Object.keys(votes).filter(
    key => votes[key].unconfirmed && !votes[key].confirmed);
  const unvoteList = Object.keys(votes).filter(
    key => !votes[key].unconfirmed && votes[key].confirmed);
  const totalVotesCount = (votedList.length - unvoteList.length) + voteList.length;
  const totalNewVotesCount = voteList.length + unvoteList.length;

  return (voteList.length + unvoteList.length ?
    <div className={`${style.fixedAtBottom} box voting-bar`}>
      <div className={`${grid.row} ${grid['center-xs']}`}>
        <span className={`${grid['col-sm-3']} ${grid['col-xs-12']}`}>
          <span>Upvotes: </span>
          <strong>{voteList.length}</strong>
        </span>
        <span className={`${grid['col-sm-3']} ${grid['col-xs-12']}`}>
          <span>Downvotes: </span>
          <strong>{unvoteList.length}</strong>
        </span>
        <span className={`${grid['col-sm-3']} ${grid['col-xs-12']}`}>
          <span>Total new votes </span>
          <strong className={totalNewVotesCount > voteMaxCount && style.red}>
            {voteList.length + unvoteList.length}
          </strong>
          <span> / {voteMaxCount}</span>
        </span>
        <span className={`${grid['col-sm-3']} ${grid['col-xs-12']}`}>
          <span>Total votes: </span>
          <strong className={totalVotesCount > 101 && style.red}>
            {(votedList.length - unvoteList.length) + voteList.length}
          </strong>
          <span> / {votedMaxCount}</span>
        </span>
      </div>
    </div> :
    null
  );
};

export default VotingBar;
