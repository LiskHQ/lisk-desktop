import React from 'react';
import TransactionSummary from '../transactionSummary';
import votingConst from '../../constants/voting';
import {
  getTotalVotesCount,
  getVoteList,
  getUnvoteList,
} from '../../utils/voting';
import routes from '../../constants/routes';

import styles from './votingSummary.css';

const VotingSummary = ({ t, votes, history }) => {
  const {
    maxCountOfVotes,
    fee,
  } = votingConst;
  const voteList = getVoteList(votes);
  console.log(voteList);
  const unvoteList = getUnvoteList(votes);
  return (
    <TransactionSummary
      confirmButton={{
        label: t('Confirm voting'),
        onClick: () => {},
      }}
      cancelButton={{
        label: t('Edit voting'),
        onClick: () => {
          history.push(routes.delegatesV2.path);
        },
      }}
      title={t('Voting summary')} >
      <section>
        <label>{t('Votes after confirmation')}</label>
        <label>{getTotalVotesCount(votes)}/{maxCountOfVotes}</label>
      </section>
      <section>
        <label>{t('Transaction fee')}</label>
        <label> {fee} LSK </label>
      </section>
      {voteList.length > 0 ?
        <section>
          <label>{t('Added votes')} ({voteList.length})</label>
          <label>
            <div className={styles.votesContainer} >
              {voteList.map(vote => (
               <span key={vote} className={`${styles.voteTag} vote`}>
                <span className={styles.rank}>#{votes[vote].rank}</span>
                <span className={styles.username}>{vote}</span>
               </span>
              ))}
            </div>
          </label>
        </section> :
        null }
      {unvoteList.length > 0 ?
        <section>
          <label>{t('Removed votes')} ({unvoteList.length})</label>
          <label>
            <div className={styles.votesContainer} >
              {unvoteList.map(vote => (
               <span key={vote} className={`${styles.voteTag} vote`}>
                <span className={styles.rank}>#{votes[vote].rank}</span>
                <span className={styles.username}>{vote}</span>
               </span>
              ))}
            </div>
          </label>
        </section> :
        null }
    </TransactionSummary>
  );
};

export default VotingSummary;
