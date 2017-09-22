import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import votingConst from '../../constants/voting';
import style from './votingBar.css';

const VotingBar = ({ votes }) => {
  const { maxCountOfVotes, maxCountOfVotesInOneTurn } = votingConst;
  const votedList = Object.keys(votes).filter(key => votes[key].confirmed);
  const voteList = Object.keys(votes).filter(
    key => votes[key].unconfirmed && !votes[key].confirmed);
  const unvoteList = Object.keys(votes).filter(
    key => !votes[key].unconfirmed && votes[key].confirmed);
  const totalVotesCount = (votedList.length - unvoteList.length) + voteList.length;
  const totalNewVotesCount = voteList.length + unvoteList.length;

  return (voteList.length + unvoteList.length ?
    <div className={`${grid.row} ${style.fixedAtBottom} box voting-bar`}>
      <div className={
        `${grid['col-sm-12']} ${grid['col-md-10']} ${grid['col-md-offset-1']}
          ${grid.row} ${grid['center-xs']} ${grid['middle-xs']}`}>
        <span className={`${grid['col-sm-3']} ${grid['col-xs-12']} upvotes`}>
          <span>Upvotes: </span>
          <strong>{voteList.length}</strong>
        </span>
        <span className={`${grid['col-sm-3']} ${grid['col-xs-12']} downvotes`}>
          <span>Downvotes: </span>
          <strong>{unvoteList.length}</strong>
        </span>
        <span className={`${grid['col-sm-3']} ${grid['col-xs-12']} total-new-votes`}>
          <span>Total new votes: </span>
          <strong className={totalNewVotesCount > maxCountOfVotesInOneTurn && style.red}>
            {totalNewVotesCount}
          </strong>
          <span> / {maxCountOfVotesInOneTurn}</span>
        </span>
        <span className={`${grid['col-sm-3']} ${grid['col-xs-12']} total-votes`}>
          <span>Total votes: </span>
          <strong className={totalVotesCount > 101 && style.red}>
            {totalVotesCount}
          </strong>
          <span> / {maxCountOfVotes}</span>
        </span>
      </div>
    </div> :
    null
  );
};

export default VotingBar;
