import React from 'react';
import { translate } from 'react-i18next';
import styles from './transactionDetailViewV2.css';

const transactionVotes = ({ votes, t }) => (
  <div className={styles.detailsWrapper}>
  {Object.keys(votes).sort().map((label, key) => (
    <React.Fragment key={key}>
      <span className={styles.label}>{
        label === 'added' ? t('Added Votes') : t('Removed Votes')
      } <span className={styles.count}>{votes[label].length}</span></span>
      <div className={`${styles.votesContainer} ${styles[label]}`}>
        {votes[label].sort((a, b) => a.rank - b.rank).map((vote, voteKey) => (
          <span key={voteKey}
            className={styles.voteTag}>
            <span className={styles.rank}>{vote.rank}</span>
            <span className={styles.username}>{vote.username}</span>
          </span>
        ))}
      </div>
    </React.Fragment>
  ))}
  </div>
);

export default translate()(transactionVotes);
