import React from 'react';
import { withTranslation } from 'react-i18next';
import Icon from '@toolbox/icon';
import styles from './warnPunishedDelegate.css';

const VoteWarning = ({ t, daysLeft }) => (
  <div className={styles.voteContainer}>
    <Icon name="warningYellow" />
    <span className={styles.rightSpace} />
    {t(
      'Caution! You are about to vote for the punished delegate, this will result in your LSK tokens being locked for a period of {{daysLeft}} days.',
      {
        daysLeft,
      },
    )}
  </div>
);

export default withTranslation()(VoteWarning);
