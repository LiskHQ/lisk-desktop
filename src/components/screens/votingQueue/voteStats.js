import React from 'react';

import styles from './styles.css';

const VoteStats = ({
  t, added, edited, removed, heading,
}) => (
  <header className={styles.header}>
    <span className={styles.heading}>{heading}</span>
    <span className={styles.voteStats}>
      <span className={styles.addedNumeral}>{`${added} `}</span>
      <span className={styles.statText}>{`${t('added')}`}</span>
    </span>
    <span className={styles.voteStats}>
      <span className={styles.editedNumeral}>{`${edited} `}</span>
      <span className={styles.statText}>{`${t('edited')}`}</span>
    </span>
    <span className={styles.voteStats}>
      <span>{`${removed} `}</span>
      <span className={styles.statText}>{`${t('removed')}`}</span>
    </span>
  </header>
);

export default VoteStats;
