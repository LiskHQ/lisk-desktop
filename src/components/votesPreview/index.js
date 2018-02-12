import { translate } from 'react-i18next';
import React, { Fragment } from 'react';
import CircularProgressBar from 'react-circular-progressbar';
import styles from './votesPreview.css';
import votingConst from '../../constants/voting';
import GradientSVG from './gradientSVG';
import { FontIcon } from '../fontIcon';
import { Button } from '../toolbox/buttons/button';
import { getTotalVotesCount, getVoteList, getUnvoteList } from './../../utils/voting';

class VotesPreview extends React.Component {
  componentDidMount() {
    this.props.updateList(false);
    if (typeof this.props.onMount === 'function') {
      this.props.onMount(false, 'VotesPreview');
    }
  }
  render() {
    const { votes, t, nextStep, updateList } = this.props;
    const { maxCountOfVotes, maxCountOfVotesInOneTurn } = votingConst;
    const voteList = getVoteList(votes);
    const unvoteList = getUnvoteList(votes);
    const totalVotesCount = getTotalVotesCount(votes);
    const totalNewVotesCount = voteList.length + unvoteList.length;
    const selectionClass = totalNewVotesCount > maxCountOfVotesInOneTurn ? styles.red : '';
    const totalClass = totalVotesCount > 101 ? styles.red : '';
    const createPercentage = (count, total) => Math.ceil((count / total) * 100);
    const surpassedVoteLimit = totalNewVotesCount > maxCountOfVotesInOneTurn ||
      totalVotesCount > 101;

    return (<Fragment>
      <section className={`${styles.wrapper} votes-preview ${surpassedVoteLimit ? styles.surpassed : ''}
        ${totalNewVotesCount > 0 ? styles.hasChanges : ''}`}>
        <header>
          <h2>{t('Votes')}</h2>
          <a target='_blank' href='http://lisk.io' rel='noopener noreferrer'>
            {t('Learn how Voting works')} <FontIcon>arrow-right</FontIcon>
          </a>
        </header>
        <section>
          <div className={`${styles.progressWrapper} ${selectionClass} selection-wrapper`}>
            <CircularProgressBar
              className={styles.progress}
              percentage={createPercentage(totalNewVotesCount, maxCountOfVotesInOneTurn)}
              textForPercentage={() => ''}/>
            <article className='selection'>
              <span>{t('Selection')} </span>
              <h4>{totalNewVotesCount}</h4>
              <span>/ {maxCountOfVotesInOneTurn}</span>
            </article>
          </div>
          <div className={`${styles.progressWrapper} ${totalClass} ${styles.totalWrapper} total-wrapper`}>
            <CircularProgressBar
              className={styles.progress}
              percentage={createPercentage(totalVotesCount, maxCountOfVotes)}
              textForPercentage={() => ''}/>
            <article className='total'>
              <span>{t('Total')} </span>
              <h4>{totalVotesCount}</h4>
              <span>/ {maxCountOfVotes}</span>
            </article>
          </div>
        </section>
        <Button label={t('Next')}
          className={`${styles.button} next`}
          type='button'
          onClick={() => { updateList(true); nextStep({}); }}
          disabled={totalNewVotesCount === 0 || surpassedVoteLimit} />
      </section>
      <GradientSVG
        id='grad'
        rotation={0}
        startColor='#BFF9FF'
        endColor='#6693FF' />
      <GradientSVG
        id='danger'
        rotation={0}
        startColor='#FF6236'
        endColor='#C80039' />
    </Fragment>);
  }
}

export default translate()(VotesPreview);
