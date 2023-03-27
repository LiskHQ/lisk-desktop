import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './stakeStats.css';

const StakeStats = ({ added, edited, removed }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.statsContainer}>
      <span className={styles.stakeStats}>
        <span className={styles.addedNumeral}>{`${added} `}</span>
        <span className={styles.statText}>{`${t('added')}`}</span>
      </span>
      <span className={styles.stakeStats}>
        <span className={styles.editedNumeral}>{`${edited} `}</span>
        <span className={styles.statText}>{`${t('edited')}`}</span>
      </span>
      <span className={styles.stakeStats}>
        <span className={styles.removedNumeral}>{`${removed} `}</span>
        <span className={styles.statText}>{`${t('removed')}`}</span>
      </span>
    </div>
  );
};

export default StakeStats;
