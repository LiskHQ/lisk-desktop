import React from 'react';

import styles from './styles.css';

const VoteStats = ({
  t, added, edited, removed, heading,
}) => (
  <header className={styles.header}>
    <span className={styles.heading}>{heading}</span>
    <span className={styles.voteStats}>{`${added} ${t('added')}`}</span>
    <span className={styles.voteStats}>{`${edited} ${t('edited')}`}</span>
    <span className={styles.voteStats}>{`${removed} ${t('removed')}`}</span>
  </header>
);

export default VoteStats;
