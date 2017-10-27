import { translate } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import style from './votingBar.css';
import votingConst from '../../constants/voting';
import { getTotalVotesCount, getVoteList, getUnvoteList } from './../../utils/voting';

const VotingBar = ({ votes, t }) => {
  const { maxCountOfVotes, maxCountOfVotesInOneTurn } = votingConst;
  const voteList = getVoteList(votes);
  const unvoteList = getUnvoteList(votes);
  const totalVotesCount = getTotalVotesCount(votes);
  const totalNewVotesCount = voteList.length + unvoteList.length;

  return (voteList.length + unvoteList.length ?
    <div className={`${grid.row} ${style.fixedAtBottom} box voting-bar`}>
      <div className={
        `${grid['col-sm-12']} ${grid['col-md-10']} ${grid['col-md-offset-1']}
          ${grid.row} ${grid['center-xs']} ${grid['middle-xs']}`}>
        <span className={`${grid['col-sm-3']} ${grid['col-xs-12']} upvotes`}>
          <span>{t('Upvotes:')} </span>
          <strong>{voteList.length}</strong>
        </span>
        <span className={`${grid['col-sm-3']} ${grid['col-xs-12']} unvotes`}>
          <span>{t('Downvotes:')} </span>
          <strong>{unvoteList.length}</strong>
        </span>
        <span className={`${grid['col-sm-3']} ${grid['col-xs-12']} total-new-votes`}>
          <span>{t('Total new votes:')} </span>
          <strong className={totalNewVotesCount > maxCountOfVotesInOneTurn && style.red}>
            {totalNewVotesCount}
          </strong>
          <span> / {maxCountOfVotesInOneTurn}</span>
        </span>
        <span className={`${grid['col-sm-3']} ${grid['col-xs-12']} total-votes`}>
          <span>{t('Total votes:')} </span>
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

export default translate()(VotingBar);
