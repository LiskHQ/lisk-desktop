import { translate } from 'react-i18next';
import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import CircularProgressbar from 'react-circular-progressbar';
import Box from '../box';
import styles from './votesPreview.css';
import votingConst from '../../constants/voting';
import GradientSVG from './gradientSVG';
import { getTotalVotesCount, getVoteList, getUnvoteList } from './../../utils/voting';

const VotesPreview = ({ votes, t }) => {
  const { maxCountOfVotes, maxCountOfVotesInOneTurn } = votingConst;
  const voteList = getVoteList(votes);
  const unvoteList = getUnvoteList(votes);
  const totalVotesCount = getTotalVotesCount(votes);
  const totalNewVotesCount = voteList.length + unvoteList.length;

  const createPercentage = (count, total) => Math.ceil((count / total) * 100);

  return (<Box className={`${grid.row} ${styles.fixedAtBottom} voting-bar`}>
    <div className={
      `${grid['col-sm-12']} ${grid['col-md-10']} ${grid['col-md-offset-1']}
        ${grid.row} ${grid['center-xs']} ${grid['middle-xs']}`}>
      <div className='total-new-votes'>
        <CircularProgressbar
          className={styles.progress}
          percentage={createPercentage(totalNewVotesCount, maxCountOfVotesInOneTurn)}
          textForPercentage={pct => `${pct}%`}/>
        <span>{t('Total new votes:')} </span>
        <strong className={totalNewVotesCount > maxCountOfVotesInOneTurn ? styles.red : ''}>
          {totalNewVotesCount}
        </strong>
        <span> / {maxCountOfVotesInOneTurn}</span>
      </div>
      <div className='total-votes'>
        <CircularProgressbar
          className={styles.progress}
          percentage={createPercentage(totalVotesCount, maxCountOfVotes)}
          textForPercentage={pct => `${pct}%`}/>
        <span>{t('Total votes:')} </span>
        <strong className={totalVotesCount > 101 ? styles.red : ''}>
          {totalVotesCount}
        </strong>
        <span> / {maxCountOfVotes}</span>
      </div>
    </div>
    <GradientSVG
      id='grad'
      rotation={0}
      startColor='#6693FF'
      endColor='#BFF9FF' />
  </Box>
  );
};

export default translate()(VotesPreview);
